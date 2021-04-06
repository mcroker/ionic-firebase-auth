// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Mal
import { IAPurchaseService } from 'ionic-firebase-iap';

// Ionic
import { IonicModule } from '@ionic/angular';

// Translate
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Angular Fire

// Fakes
import { FakeIAPurchaseService } from './fakes';

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
    { provide: IAPurchaseService, useClass: FakeIAPurchaseService }
  ]
})
export class AuthTestingModule { }
