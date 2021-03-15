import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { AuthProcessService, AuthProvider, UiService } from 'ngx-firebase';
import { map } from 'rxjs/operators';
import { NgxAuthFirebaseuiAnimations } from '../../animations';

@Component({
  selector: 'mal-authui-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUIReauthenticateComponent implements AfterViewInit {

  @Input() logoUrl?: string;
  @Input() providers: string[] | string = AuthProvider.ALL; //  google, facebook, twitter, github as array or all as one single string
  @Input() registrationEnabled = true;
  @Input() resetPasswordEnabled = true;
  @Input() tosUrl: string = '';
  @Input() privacyPolicyUrl: string = '';

  // Events
  // tslint:disable no-output-on-prefix
  @Output() onSuccess: any = this.aps.onSuccessEmitter;
  @Output() onError: any = this.aps.onErrorEmitter;
  @Output() onCreateAccountRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output() onResetPasswordRequested: EventEmitter<void> = new EventEmitter<void>();
  // tslint:enable no-output-on-prefix

  readonly providers$ = this.aps.reauthenticateProviders$;
  readonly showPasswordProvider$ = this.providers$.pipe(map(providers => providers.includes(AuthProvider.EmailAndPassword)));
  readonly showDivider$ = this.providers$.pipe(map(providers => providers.length > 1 && providers.includes(AuthProvider.EmailAndPassword)));

  public message: string = '';

  public readonly reauthForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    // tslint:disable-next-line @typescript-eslint/ban-types
    public aps: AuthProcessService,
    private ui: UiService,
    private changeDetectorRef: ChangeDetectorRef,
    private popoverController: PopoverController
  ) { }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  async dismiss() {
    if (this.popoverController.getTop() !== null) {
      await this.popoverController.dismiss();
    }
  }

  async doReauthenticateWithPassword() {
    try {
      if (!this.aps.user?.email || !this.reauthForm.value.password) {
        throw new Error('Trying to reauth with email/password when not valid');
      }
      await this.aps.reauthenicateWithProvider(
        AuthProvider.EmailAndPassword, { credentials: { email: this.aps.user.email, password: this.reauthForm.value.password } }
      );
    } catch (error) {
      this.ui.logError(error);
    } finally {
      await this.dismiss();
    }
  }

  doProviderClick(provider: AuthProvider) {
    try {
      this.aps.reauthenicateWithProvider(provider);
    } catch (error) {
      this.ui.logError(error);
    }
  }

}
