import { of } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IAPurchaseService } from 'ionic-firebase-iap';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

class FakeIAPurchaseService {
    constructor() {
        this.selectVerified = jasmine.createSpy('selectVerified');
        this.selectVerified.and.callFake(product => of(product));
    }
    static create() {
        return new FakeIAPurchaseService();
    }
}

// Mal

// Angular
const MODULES = [
    CommonModule,
    IonicModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
];
class AuthTestingModule {
}
AuthTestingModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AuthTestingModule, FakeIAPurchaseService, MODULES, FakeIAPurchaseService as ɵa };
//# sourceMappingURL=ionic-firebase-iap-testing.js.map
