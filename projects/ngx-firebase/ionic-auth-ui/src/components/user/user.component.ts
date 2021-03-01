import { Component, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthProcessService, MalSharedConfigToken, MalSharedConfig, FirebaseErrorCodes, PHONE_NUMBER_REGEX, CrashlyticsService } from 'ngx-firebase';
import { MalIonicToastService, MalIonicAlertsService } from 'ngx-firebase/ionic';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NavController, PopoverController } from '@ionic/angular';
import { UserInfo, User } from '@firebase/auth-types';

@Component({
  selector: 'mal-authui-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss', '../../ionic-auth-ui.scss']
})
export class AuthUIUserComponent implements OnInit, OnDestroy {

  @Input()
  get editMode(): boolean { return this._editMode$.value; }
  set editMode(val: boolean) { this._editMode$.next(val); }
  get editMode$(): Observable<boolean> { return this._editMode$.asObservable(); }
  private _editMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  canEditAccount = this.config.authUi.allowAccountEdit;
  canLogout = this.config.authUi.allowAccountLogout;
  canDeleteAccount = this.config.authUi.allowAccountDelete;

  // tslint:disable no-output-on-prefix
  @Output() onSignOut: EventEmitter<void> = this.aps.onSignOutEmitter;
  @Output() onAccountEdited: EventEmitter<UserInfo> = this.aps.onUserUpdatedEmitter;
  @Output() onAccountDeleted: EventEmitter<void> = this.aps.onUserDeletedEmitter;
  // tslint:enable no-output-on-prefix

  private destroy$: Subject<void> = new Subject<void>();

  userPhotoUrl$: Observable<string | null> = this.aps.getUserPhotoUrl();
  user$: Observable<User | null> = this.aps.user$;

  public readonly updateFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.pattern(PHONE_NUMBER_REGEX)])
  });

  constructor(
    public aps: AuthProcessService,
    private toast: MalIonicToastService,
    private navController: NavController,
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    private popoverController: PopoverController,
    private crashlytics: CrashlyticsService,
    private alerts: MalIonicAlertsService
  ) {
  }
  ngOnInit() {
    this.aps.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentUser => {
        if (currentUser) {
          this.updateFormGroup.patchValue({
            name: currentUser.displayName,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber
          });
          this.updateFormGroup.markAsPristine();
        } else {
          this.updateFormGroup.reset();
          this.editMode = false;
        }
      });

    this.editMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(editMode => {
        if (editMode) {
          this.updateFormGroup.enable();
        } else {
          this.updateFormGroup.disable();
        }
      });

    this.editMode = false;
    this.updateFormGroup.disable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeEditMode() {
    this.editMode = !this.editMode;
  }

  async dismiss() {
    if (this.popoverController.getTop() !== null) {
      await this.popoverController.dismiss();
    }
  }

  async save() {
    if (this.updateFormGroup.dirty) {

      try {
        await this.aps.updateUserInfo({
          displayName: (this.updateFormGroup.controls.name.dirty) ? this.updateFormGroup.controls.name.value : undefined,
          email: (this.updateFormGroup.controls.email.dirty) ? this.updateFormGroup.controls.email.value : undefined,
          phoneNumber: (this.updateFormGroup.controls.phoneNumber.dirty) ? this.updateFormGroup.controls.phoneNumber.value : undefined,
        });
      } catch (error) {
        this.crashlytics.recordException(error);
        this.toast.open(error && error.message ? error.message : error);
      }

      await this.dismiss();

    } else {
      this.editMode = false;
    }
  }

  async signOut() {
    try {
      await Promise.all([
        this.aps.signOut(),
        this.dismiss(),
        this.navController.navigateRoot(this.config.authUi.authGuardFallbackURL)
      ]);
    } catch (error) {
      this.crashlytics.recordException(error);
    }
  }

  /**
   * Delete the account of the current firebase ngx-auth-firebaseui-user
   *
   * On Success, emit the <onAccountDeleted> event and toast a msg!#
   * Otherwise, log the and toast and error msg!
   *
   * If the operation fails due to not having current enough signIn, redrect to reSignInUrl, providing forOperation=deleteUser
   *
   */
  async deleteAccount() {
    try {
      if (await this.alerts.yesNoAlert(
        'auth.user.message.confirmDelete',
        { defaultToNo: true, interpolateParams: { userName: this.aps.user?.displayName } })
      ) {
        await this.aps.deleteUser();
        await Promise.all([
          this.dismiss(),
          this.toast.open('auth.user.message.acountDeleted'),
          this.navController.navigateRoot(this.config.authUi.authGuardFallbackURL)
        ]);
      }
    } catch (error) {

      if (error.code === FirebaseErrorCodes.requiresRecentLogin) {
        // If we've failed due to lack of current credentials ask the user to reauthenticate and try again.
        await new Promise<void>(async (resolve, reject) => {
          const popover = await this.popoverController.create({
            component: await import('../reauthenticate/reauthenticate.component').then(m => m.AuthUIReauthenticateComponent),
            componentProps: {
              message: error.message
            },
            cssClass: 'wide-popover'
          });
          popover.onDidDismiss().then(async () => {
            try {
              await this.aps.deleteUser();
              await Promise.all([
                this.dismiss(),
                this.toast.open('auth.user.message.acountDeleted'),
                this.navController.navigateRoot(this.config.authUi.authGuardFallbackURL)
              ]);
            } catch (error) {
              await this.toast.open('auth.user.message.acountDeleted', { interpolateParams: { error: error.message } });
            }
            resolve();
          });
          await popover.present();
        });

      } else {
        this.crashlytics.recordException(error);
        await this.toast.open('auth.user.message.acountDeleted', { interpolateParams: { error: error.message } });
      }
    }
  }

}

