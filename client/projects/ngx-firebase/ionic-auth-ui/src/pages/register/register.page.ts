import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UiService, FirebaseService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { NgxAuthFirebaseuiAnimations } from '../../animations';

@Component({
  templateUrl: 'register.page.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthRegisterPage implements OnInit {

  readonly logoUrl?: string = this.config.authUi.logoUrl;

  constructor(
    private ui: UiService,
    private fire: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
  ) { }

  ngOnInit() {
    this.fire.setScreenName('register', 'AuthRegisterPage');
  }

  doSuccess() {
    try {
      const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
      if (redirectUrl) {
        console.log('Redirecting logged in user to>', redirectUrl);
        this.navController.navigateRoot(redirectUrl);
      } else {
        this.navController.navigateRoot(['/']);
      }
    } catch (error) {
      this.ui.logError(error);
    }
  }

  doLoginRequested() {
    try {
      this.navController.navigateRoot(['/auth', 'signin'], { queryParams: { redirectUrl: this.activatedRoute.snapshot.queryParamMap.get('redirectUrl') } });
    } catch (error) {
      this.ui.logError(error);
    }
  }

}
