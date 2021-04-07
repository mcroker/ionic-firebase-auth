import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthProcessService, AuthProvider, AuthSharedConfig, AuthSharedConfigToken } from 'ionic-firebase-auth';
import { AuthIonicAlertsService } from 'ionic-firebase-auth/ionic';
import { Subscription } from 'rxjs';
import { NgxAuthFirebaseuiAnimations } from '../../animations';

@Component({
  selector: 'auth-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUISignInComponent implements AfterViewInit {

  @Input() providers: string[] | string = AuthProvider.ALL; //  google, facebook, twitter, github as array or all as one single string
  @Input() registrationEnabled = true;
  @Input() resetPasswordEnabled = true;
  @Input() tosUrl: string = '';
  @Input() privacyPolicyUrl: string = '';

  // Events
  // tslint:disable no-output-on-prefix
  @Output() onSuccess: any = this.aps.onSignInEmitter;
  @Output() onError?: any = this.aps.onErrorEmitter;
  @Output() onCreateAccountRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output() onResetPasswordRequested: EventEmitter<void> = new EventEmitter<void>();
  // tslint:enable no-output-on-prefix

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  authProviders = AuthProvider;
  onErrorSubscription?: Subscription;

  constructor(
    // tslint:disable-next-line @typescript-eslint/ban-types
    public aps: AuthProcessService,
    private alert: AuthIonicAlertsService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => AuthSharedConfigToken)) public config: AuthSharedConfig,
  ) { }

  async signIn() {
    try {
      this.changeDetectorRef.markForCheck();
      await this.aps.signInWith(AuthProvider.EmailAndPassword, {
        credentials: {
          email: this.signInForm.value.email,
          password: this.signInForm.value.password
        }
      });
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  providerClick(provider: AuthProvider) {
    this.aps.signInWith(provider);
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  async doPasswordReset() {
    if (this.signInForm.controls.email.invalid) {
      await this.alert.errorAlert('auth.resetPassword.errors.pattern');
    } else {
      await this.aps.resetPassword(this.signInForm.value.email);
    }
  }

}
