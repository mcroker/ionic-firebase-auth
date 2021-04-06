import { IAPProductOptions as CapacitorIAPProductOptions } from '@ionic-native/in-app-purchase-2/ngx';
export declare enum IAPProductTypes {
    PAID_SUBSCRIPTION = "PAID_SUBSCRIPTION"
}
export interface IAPProductOptions extends CapacitorIAPProductOptions {
    type: IAPProductTypes;
}
export interface IAPOptions {
    validatorUrl: string;
    products: IAPProductOptions[];
}
