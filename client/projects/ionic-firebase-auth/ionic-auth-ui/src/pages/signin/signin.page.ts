import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxAuthFirebaseuiAnimations } from '../../animations';
import { AuthProcessService, AuthSharedConfigToken, AuthSharedConfig, UiService, FirebaseService } from 'ionic-firebase-auth';

export interface SocialProvider {
  name: string;
  label: string;
  loginFn: () => Promise<void>;
}

@Component({
  templateUrl: 'signin.page.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthSignInPage implements OnInit {

  readonly logoUrl?: string = this.config.authUi.logoUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private aps: AuthProcessService,
    private navController: NavController,
    private ui: UiService,
    private fire: FirebaseService,
    @Inject(forwardRef(() => AuthSharedConfigToken)) public config: AuthSharedConfig,
  ) { }

  ngOnInit() {
    this.fire.setScreenName('signin', 'AuthSignInPage');
  }

  async doSuccess(e: any) {

    const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
    const forOperation = this.activatedRoute.snapshot.queryParamMap.get('forOperation');

    if (redirectUrl) {
      // Ridirect to page on SignIn
      this.fire.addLogMessage(`Redirecting logged in user to> ${redirectUrl}`);
      await this.navController.navigateRoot(redirectUrl);

    } else {
      try {
        switch (forOperation) {

          case 'deleteUser':
            if (await this.ui.yesNoAlert(
              'auth.user.message.confirmDelete',
              { interpolateParams: { userName: this.aps.user?.displayName } })
            ) {
              await this.aps.deleteUser();
            }
            break;

          case undefined:
          case null:
            break;

          default:
            throw new Error(`Unknown forOperation: ${forOperation}`);

        }
      } catch (error) {
        this.ui.logError(error);
      } finally {
        await this.navController.navigateRoot(this.config.authUi.authGuardLoggedInURL);
      }
    }
  }

  doCreateAccountRequested() {
    try {
      return this.navController.navigateRoot(
        ['/auth', 'register'],
        { queryParams: { redirectUrl: this.activatedRoute.snapshot.queryParamMap.get('redirectUrl') } }
      );
    } catch (error) {
      this.ui.logError(error);
    }
  }

}
