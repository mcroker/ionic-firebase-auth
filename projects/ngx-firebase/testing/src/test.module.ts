// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Mal
import { CrashlyticsService, AuthProcessService, RemoteConfigService, AnalyticsService, MalService, MalLoadingUIProviderToken } from 'ngx-firebase';
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
  FakeCrashlyticsService, FakeAuthProcessService, FakeAngularFirePerformance, FakeRemoteConfigService, FakeAngularFirestore,
  FakeAngularFireFunctions, FakeIAPurchaseService, FakeLoadingService, FakeAnalyticsService, FakeAngularFireStorage, FakeMalService
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
    { provide: CrashlyticsService, useClass: FakeCrashlyticsService },
    { provide: AuthProcessService, useClass: FakeAuthProcessService },
    { provide: IAPurchaseService, useClass: FakeIAPurchaseService },
    { provide: MalLoadingUIProviderToken, useClass: FakeLoadingService },
    { provide: AnalyticsService, useClass: FakeAnalyticsService },
    { provide: MalService, useClass: FakeMalService },
    // @angular/fire
    { provide: AngularFirestore, useClass: FakeAngularFirestore },
    { provide: AngularFireFunctions, useClass: FakeAngularFireFunctions },
    { provide: AngularFirePerformance, useClass: FakeAngularFirePerformance },
    { provide: AngularFireStorage, useClass: FakeAngularFireStorage }
  ]
})
export class MalTestingModule { }
