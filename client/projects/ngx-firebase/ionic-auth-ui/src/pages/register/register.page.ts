import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UiService, FirebaseService } from 'ngx-firebase';

@Component({
  templateUrl: 'register.page.html',
  styleUrls: ['../../ionic-auth-ui.scss']
})
export class AuthRegisterPage implements OnInit {

  constructor(
    private ui: UiService,
    private fire: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController
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
