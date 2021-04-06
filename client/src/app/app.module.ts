// Angular
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Mal
import { AuthSharedModule, AuthProvider } from 'ionic-firebase-auth';

// Capacitor
import { environment } from '../environments/environment';

// App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Pages
import { HomePage } from './components/home-page/home.page';

import { TooltipsModule } from 'ionic4-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';
import { AuthCapacitorModule } from 'ionic-firebase-auth/capacitor';
import { GuardedPage } from './components/guarded/guarded.page';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    GuardedPage
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    AuthSharedModule,
    AuthCapacitorModule.forRoot(environment),
    AppRoutingModule,
    AuthSharedModule.forRoot({
      ...environment,
      authUi: {
        toastMessageOnAuthSuccess: false,
        authGuardFallbackURL: '/home',
        guardProtectedRoutesUntilEmailIsVerified: true,
        authGuardVerifyEmailURL: '/auth/verify',
        logoUrl: '/assets/logo.png',
        reSignInUrl: '/auth/signin',
        verifyEmailBackground: 'background-girl-reading-1',
        supportedProviders: [AuthProvider.Apple, AuthProvider.Facebook, AuthProvider.Google],
        tosUrl: environment.uri.tosUrl,
        privacyPolicyUrl: environment.uri.privacyUrl,
        enableFirestoreSync: true,
        guestEnabled: true
      }
    }),
    TooltipsModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(@Inject(PLATFORM_ID) id: any) {
    console.log('ID>', id);
  }

}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
