// Angular
import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

// Mal
import { AuthProcessService, MalSharedConfig, MalSharedConfigToken, MalService } from 'ngx-firebase';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'verifyemail.page.html',
  styleUrls: ['../../ionic-auth-ui.scss']
})
export class AuthVerifyEmailPage implements OnInit, OnDestroy {

  readonly backgroundClass = this.config?.authUi.verifyEmailBackground || '';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private mal: MalService,
    private aps: AuthProcessService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
  ) { }

  ngOnInit() {
    this.mal.setScreenName('verifyemail', 'VerifyEmailPage');

    this.aps.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      try {
        if (user && user.emailVerified) {
          this.doRetry();
        }
      } catch (error) {
        this.mal.logError(error);
      }
    });

    this.aps.onSignOutEmitter.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      try {
        this.navCtrl.navigateRoot(this.config.authUi.authGuardFallbackURL || '/');
      } catch (error) {
        this.mal.logError(error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async doRetry() {
    try {
      await this.aps.reloadUserInfo();
      const redirect = this.route.snapshot.queryParamMap.get('redirectUrl');
      this.navCtrl.navigateRoot(redirect);
    } catch (error) {
      this.mal.logError(error);
    }
  }

  async doResendVerification() {
    try {
      await this.aps.sendNewVerificationEmail();
      await this.mal.toast('auth.emailConfirmation.onConfirmationSuccess');
    } catch (error) {
      this.mal.logError(error);
    }
  }

}
