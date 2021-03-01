// Angular & Inionc
import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit,
  Output, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// RxJS
import { Observable, Subject } from 'rxjs';

// Mal
import { NgxAuthFirebaseuiAnimations } from '../../animations';
import { AuthProcessService, AuthProvider, MalService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';


@Component({
  selector: 'mal-authui-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUIRegisterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() logoUrl?: string = this.config.authUi.logoUrl;
  @Input() providers: string[] | string = AuthProvider.ALL; //  google, facebook, twitter, github as array or all as one single string

  // Events
  // tslint:disable no-output-on-prefix
  @Output() onSuccess: EventEmitter<any> = this.aps.onSuccessEmitter;
  @Output() onError: EventEmitter<any> = this.aps.onErrorEmitter;
  @Output() onLoginRequested: EventEmitter<void> = new EventEmitter<void>();
  // tslint:enable no-output-on-prefix

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    tos: new FormControl(true, []),
    privacyPolicy: new FormControl(true, [])
  });

  // Prevent somebody already logged in as guest - relogging in as gyest
  guestEnabled$: Observable<boolean> = this.aps.canSignInAsGuest$;

  // Config
  tosUrl = this.config.authUi.tosUrl;
  privacyPolicyUrl = this.config.authUi.privacyPolicyUrl;

  // Private
  private destroy$: Subject<void> = new Subject<void>();

  // tslint:disable-next-line @typescript-eslint/ban-types
  constructor(
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    public aps: AuthProcessService,
    private mal: MalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // If tos or privacy policy url set, ensure that the two form items are required
    if (this.config.authUi.tosUrl) {
      this.registerForm.controls.tos.setValidators(Validators.requiredTrue);
    }
    if (this.config.authUi.privacyPolicyUrl) {
      this.registerForm.controls.privacyPolicy.setValidators(Validators.requiredTrue);
    }
    this.registerForm.updateValueAndValidity();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async doCreateAccount(): Promise<void> {
    try {
      this.changeDetectorRef.markForCheck();
      await this.aps.registerWith(
        AuthProvider.EmailAndPassword,
        {
          credentials: {
            email: this.registerForm.controls.email.value,
            password: this.registerForm.controls.password.value
          },
          displayName: this.registerForm.controls.name.value,
          skipTosCheck: true
        }
      );
    } catch (error) {
      this.mal.logError(error);
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  async doSignUpAnonymously() {
    try {
      this.changeDetectorRef.markForCheck();
      await this.aps.signInWith(AuthProvider.ANONYMOUS);
    } catch (error) {
      this.mal.logError(error);
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  doProviderClick(provider: AuthProvider) {
    try {
      this.aps.registerWith(provider);
    } catch (error) {
      this.mal.logError(error);
    }
  }

}
