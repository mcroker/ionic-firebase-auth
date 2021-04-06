// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Mal
import {
  AuthProcessService,
  RemoteConfigService,
  UiService,
  FirebaseService,
  AnalyticsService,
  AuthLegaliyDialogUIProiderToken,
  CrashlyticsService,
  AuthToastUIProviderToken,
  AuthAlertsUIProviderToken,
  AuthLoadingUIProviderToken,
  PerformanceService
} from 'ionic-firebase-auth';

// Ionic
import { IonicModule } from '@ionic/angular';

// Translate
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Angular Fire
import { AngularFirePerformance } from '@angular/fire/performance';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';

// Fakes
import {
  FakeAuthProcessService,
  FakeAngularFirePerformance,
  FakeRemoteConfigService,
  FakeAngularFirestore,
  FakeAngularFireFunctions,
  FakeAngularFireStorage,
  FakeUiService,
  FakeFirebaseService
} from './fakes';

export const MODULES = [
  CommonModule,
  IonicModule,
  NoopAnimationsModule,
  HttpClientTestingModule,
  RouterTestingModule,
];

@NgModule({
  imports: [
    ...MODULES,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
    })
  ],
  exports: [
    ...MODULES,
    TranslateModule
  ],
  providers: [
    // mal fakes
    { provide: RemoteConfigService, useClass: FakeRemoteConfigService },
    { provide: AuthProcessService, useClass: FakeAuthProcessService },
    // UiFakes
    { provide: UiService, useClass: FakeUiService },
    { provide: AuthLegaliyDialogUIProiderToken, useClass: FakeUiService },
    { provide: AuthToastUIProviderToken, useClass: FakeUiService },
    { provide: AuthAlertsUIProviderToken, useClass: FakeUiService },
    { provide: AuthLoadingUIProviderToken, useClass: FakeUiService },
    // Firebase Fakes
    { provide: FirebaseService, useClass: FakeFirebaseService },
    { provide: CrashlyticsService, useClass: FakeFirebaseService },
    { provide: AnalyticsService, useClass: FakeFirebaseService },
    { provide: PerformanceService, useClass: FakeFirebaseService },
    // @angular/fire
    { provide: AngularFirestore, useClass: FakeAngularFirestore },
    { provide: AngularFireFunctions, useClass: FakeAngularFireFunctions },
    { provide: AngularFirePerformance, useClass: FakeAngularFirePerformance },
    { provide: AngularFireStorage, useClass: FakeAngularFireStorage }
  ]
})
export class AuthTestingModule { }
