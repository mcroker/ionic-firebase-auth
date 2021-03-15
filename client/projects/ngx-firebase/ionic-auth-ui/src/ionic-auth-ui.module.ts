// @angular/*
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TooltipsModule } from 'ionic4-tooltips';

// Mal
import { MalSharedModule } from 'ngx-firebase';
import { MalIonicModule } from 'ngx-firebase/ionic';
import { MalIonicUISharedModule } from './ionic-auth-ui-shared.module';

// components
import { AuthUISignInComponent } from './components/signin/signin.component';
import { AuthUIRegisterComponent } from './components/register/register.component';
import { AuthUIUserComponent } from './components/user/user.component';
import { AuthUIReauthenticateComponent } from './components/reauthenticate/reauthenticate.component';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
// services
// interfaces
// pages
import { AuthSignInPage } from './pages/signin';
import { AuthRegisterPage } from './pages/register';
import { AuthUserPage } from './pages/user';
import { AuthVerifyEmailPage } from './pages/verifyemail';

const COMPONENTS = [
  AuthUIUserComponent,
  EmailConfirmationComponent,
  AuthUISignInComponent,
  AuthUIRegisterComponent,
  AuthUIReauthenticateComponent,
  AuthSignInPage,
  AuthRegisterPage,
  AuthUserPage,
  AuthVerifyEmailPage
];

export const IONIC_AUTH_UI_ROUTER_CONFIG = [
  { path: 'signin', component: AuthSignInPage },
  { path: 'register', component: AuthRegisterPage },
  { path: 'user', component: AuthUserPage },
  { path: 'verify', component: AuthVerifyEmailPage },
  { path: '', pathMatch: 'full', redirectTo: 'signin' }
];

@NgModule({
  imports: [
    MalSharedModule,
    MalIonicModule,
    IonicModule,
    CommonModule,
    TooltipsModule,
    MalIonicUISharedModule,
    HttpClientModule
  ],
  exports: [
    COMPONENTS,
    MalIonicUISharedModule
  ],
  declarations: COMPONENTS,
  entryComponents: [
    AuthUIUserComponent
  ]
})
export class MalIonicAuthUiModule {

}


// Guards

// Components

// services
