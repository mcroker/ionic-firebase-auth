import { NgZone } from '@angular/core';
import { AuthProcessService, FirebaseService, AuthSharedConfig } from 'ionic-firebase-auth';
import { Platform } from '@ionic/angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Observable } from 'rxjs';
import { IAPOptions } from '../interfaces';
export declare function slimDown(p: IAPProduct[]): Partial<IAPProduct>[];
export declare function slimDown(p: IAPProduct): Partial<IAPProduct>;
export declare enum ProductStates {
    owned = "owned",
    approved = "approved",
    initiated = "initiated",
    requested = "requested",
    valid = "valid",
    registered = "registered",
    downloading = "downloading",
    downloaded = "downloaded",
    finsihed = "finished"
}
export declare class IAPurchaseService {
    private plt;
    private store;
    private aps;
    private ngZone;
    private fire;
    private options;
    private sharedConfig;
    readonly activeStates: string[];
    private _isLoading$;
    isLoading$: Observable<boolean>;
    get isLoading(): boolean;
    set isLoading(val: boolean);
    private readonly isModuleEnabled;
    readonly products$: Observable<IAPProduct[]>;
    readonly activeProducts$: Observable<IAPProduct[]>;
    readonly productsHeld$: Observable<IAPProduct[]>;
    selectAllProducts(): Observable<IAPProduct[]>;
    selectProduct(product: string | IAPProduct): Observable<IAPProduct>;
    selectIsOwned(product: string | IAPProduct): Observable<boolean>;
    selectVerified(product?: string | IAPProduct): Observable<IAPProduct>;
    selectOwned(product?: string | IAPProduct): Observable<IAPProduct>;
    constructor(plt: Platform, store: InAppPurchase2, aps: AuthProcessService, ngZone: NgZone, fire: FirebaseService, options: IAPOptions, sharedConfig: AuthSharedConfig);
    private load;
    purchase(product: IAPProduct | string, waitForOwned?: boolean): Observable<IAPProduct>;
    finish(product: IAPProduct): Promise<IAPProduct>;
    refresh(): Promise<void>;
}
