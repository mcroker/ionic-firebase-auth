import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthProcessService, AuthProvider, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { MalIonicAlertsService } from 'ngx-firebase/ionic';
import { Subscription } from 'rxjs';
import { NgxAuthFirebaseuiAnimations } from '../../animations';

@Component({
  selector: 'mal-authui-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUISignInComponent implements AfterViewInit {

  @Input() logoUrl?: string = this.config.authUi.logoUrl;
  @Input() providers: string[] | string = AuthProvider.ALL; //  google, facebook, twitter, github as array or all as one single string
  @Input() registrationEnabled = true;
  @Input() resetPasswordEnabled = true;
  @Input() tosUrl: string = '';
  @Input() privacyPolicyUrl: string = '';

  // Events
  // tslint:disable no-output-on-prefix
  @Output() onSuccess: any = this.aps.onSuccessEmitter;
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
    private alert: MalIonicAlertsService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
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
