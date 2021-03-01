import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { IAPurchaseService } from 'ngx-firebase/iap';
import { Observable, of } from 'rxjs';

export class FakeIAPurchaseService {

    selectVerified: jasmine.Spy<(product: string | IAPProduct) => Observable<IAPProduct>>
        = jasmine.createSpy<(product: string | IAPProduct) => Observable<IAPProduct>>('selectVerified');

    constructor() {
        this.selectVerified.and.callFake(product => of(product as IAPProduct));
    }

    static create(): FakeIAPurchaseService & IAPurchaseService {
        return new FakeIAPurchaseService() as any as FakeIAPurchaseService & IAPurchaseService;
    }

}
