// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Mal
import { MalSharedModule, AuthProvider } from 'ngx-firebase';

// Capacitor
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { environment } from '../environments/environment';

// App
import { AppComponent } from './app.component';

// Pages
import { HomePage } from './components/home-page/home.page';

import { TooltipsModule } from 'ionic4-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomePage
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MalSharedModule,
    IonicModule.forRoot({
      animated: !environment.e2eAutomation
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    MalSharedModule.forRoot({
      firebase: environment.firebase,
      services: environment.services,
      configDefaults: environment.configDefaults,
      authUi: {
        toastMessageOnAuthSuccess: false,
        authGuardFallbackURL: '/home',
        guardProtectedRoutesUntilEmailIsVerified: true,
        authGuardVerifyEmailURL: '/auth/verify',
        logoUrl: '/assets/images/logo.png',
        reSignInUrl: '/auth/signin',
        verifyEmailBackground: 'background-girl-reading-1',
        supportedProviders: [AuthProvider.Apple, AuthProvider.Facebook, AuthProvider.Google],
        tosUrl: environment.uri.tosUrl,
        privacyPolicyUrl: environment.uri.privacyUrl,
        guestEnabled: true
      }
    }),
    TooltipsModule.forRoot()
  ],
  providers: [
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
