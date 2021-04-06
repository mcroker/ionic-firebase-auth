/// <reference types="jasmine" />
import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { IAPurchaseService } from 'ionic-firebase-iap';
import { Observable } from 'rxjs';
export declare class FakeIAPurchaseService {
    selectVerified: jasmine.Spy<(product: string | IAPProduct) => Observable<IAPProduct>>;
    constructor();
    static create(): FakeIAPurchaseService & IAPurchaseService;
}
