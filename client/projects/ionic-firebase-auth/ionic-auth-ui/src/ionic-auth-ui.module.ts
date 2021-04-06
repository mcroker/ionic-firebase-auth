// @angular/*
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TooltipsModule } from 'ionic4-tooltips';

// Mal
import { AuthSharedModule } from 'ionic-firebase-auth';
import { AuthIonicModule } from 'ionic-firebase-auth/ionic';

// components
import { AuthUISignInComponent } from './components/signin/signin.component';
import { AuthUIRegisterComponent } from './components/register/register.component';
import { AuthUIUserComponent } from './components/user/user.component';
import { AuthUIReauthenticateComponent } from './components/reauthenticate/reauthenticate.component';
import { AuthEmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { AuthUINameFieldComponent } from './components/name-field/name-field.component';
import { AuthUIPasswordFieldComponent } from './components/password-field/password-field.component';
import { AuthUIEmailFieldComponent } from './components/email-field/email-field.component';
import { AuthUIOrDividerComponent } from './components/or-divider/or-divider.component';
import { AuthUIFormFieldComponent } from './components/form-field/form-field.component';
import { AuthProvidersComponent } from './components/providers/providers.component';
import { AuthUITermsFieldComponent } from './components/terms-field/terms-field.component';
import { AuthUIRegisterWithEmailComponent } from './components/register-with-email/register-with-email.component';
import { AuthUIRegisterWithEmailPopoverComponent } from './components/register-with-email-popover/register-with-email-popover.component';
// services
// interfaces
// pages
import { AuthSignInPage } from './pages/signin';
import { AuthRegisterPage } from './pages/register';
import { AuthUserPage } from './pages/user';
import { AuthVerifyEmailPage } from './pages/verifyemail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

const COMPONENTS = [
  AuthUIUserComponent,
  AuthEmailConfirmationComponent,
  AuthUISignInComponent,
  AuthUIRegisterComponent,
  AuthUIReauthenticateComponent,
  AuthSignInPage,
  AuthRegisterPage,
  AuthUserPage,
  AuthVerifyEmailPage,
  AuthUIPasswordFieldComponent,
  AuthUIEmailFieldComponent,
  AuthUINameFieldComponent,
  AuthUIFormFieldComponent,
  AuthUITermsFieldComponent,
  AuthUIRegisterWithEmailComponent,
  AuthUIRegisterWithEmailPopoverComponent,
  AuthUIOrDividerComponent,
  AuthProvidersComponent
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
    AuthSharedModule,
    AuthIonicModule,
    IonicModule,
    CommonModule,
    TooltipsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  exports: [
    ...COMPONENTS,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    IonicModule
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
