import { ModuleWithProviders } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { AuthSharedConfig } from 'ionic-firebase-auth';
import { IAPOptions } from './interfaces';
export declare class IAPModule {
    static forRoot(options: IAPOptions): ModuleWithProviders<IAPModule>;
}
export declare function functionsInAppPurchase2Factory(sharedConfig: AuthSharedConfig): InAppPurchase2 | undefined;
