import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IONIC_AUTH_UI_ROUTER_CONFIG, MalIonicAuthUiModule } from 'ionic-firebase-auth/ionic-auth-ui';

@NgModule({
  imports: [
    MalIonicAuthUiModule,
    RouterModule.forChild(IONIC_AUTH_UI_ROUTER_CONFIG)
  ]
})
export class AuthUIPageModule { }
