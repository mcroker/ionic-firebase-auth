import { IAPProductOptions } from '@ionic-native/in-app-purchase-2/ngx';

export enum IAPProductTypes {
    PAID_SUBSCRIPTION = 'PAID_SUBSCRIPTION'
}

export interface MalIAPProductOptions extends IAPProductOptions {
    type: IAPProductTypes;
}

export interface MalIAPOptions {
    validatorUrl: string;
    products: MalIAPProductOptions[];
}
