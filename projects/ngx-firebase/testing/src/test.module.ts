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
  MalLegaliyDialogUIProiderToken,
  CrashlyticsService,
  MalToastUIProviderToken,
  MalAlertsUIProviderToken,
  MalLoadingUIProviderToken,
  PerformanceService
} from 'ngx-firebase';
import { IAPurchaseService } from 'ngx-firebase/iap';

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
  FakeIAPurchaseService,
  FakeAngularFireStorage,
  FakeUiService,
  FakeFirebaseService,
  FakeAvatarComponent
} from './fakes';

export const MODULES = [
  CommonModule,
  IonicModule,
  NoopAnimationsModule,
  HttpClientTestingModule,
  RouterTestingModule,
];

const COMPONENTS = [
  FakeAvatarComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ...MODULES,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
    })
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    TranslateModule
  ],
  providers: [
    // mal fakes
    { provide: RemoteConfigService, useClass: FakeRemoteConfigService },
    { provide: AuthProcessService, useClass: FakeAuthProcessService },
    { provide: IAPurchaseService, useClass: FakeIAPurchaseService },
    // UiFakes
    { provide: UiService, useClass: FakeUiService },
    { provide: MalLegaliyDialogUIProiderToken, useClass: FakeUiService },
    { provide: MalToastUIProviderToken, useClass: FakeUiService },
    { provide: MalAlertsUIProviderToken, useClass: FakeUiService },
    { provide: MalLoadingUIProviderToken, useClass: FakeUiService },
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
export class MalTestingModule { }
