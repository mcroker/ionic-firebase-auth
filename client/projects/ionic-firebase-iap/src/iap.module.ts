// @angular/*
import { ModuleWithProviders, NgModule } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { AuthSharedConfig, AuthSharedConfigToken } from 'ionic-firebase-auth';
import { IAPOptions } from './interfaces';
import { IAPOptionsToken } from './tokens';

@NgModule({})
export class IAPModule {

  static forRoot(options: IAPOptions): ModuleWithProviders<IAPModule> {
    return {
      ngModule: IAPModule,
      providers:
        [
          { provide: IAPOptionsToken, useValue: options },
          {
            provide: InAppPurchase2,
            useFactory: functionsInAppPurchase2Factory,
            deps: [AuthSharedConfigToken]
          },
        ]
    };
  }

}

export function functionsInAppPurchase2Factory(sharedConfig: AuthSharedConfig): InAppPurchase2 | undefined {
  if (false === sharedConfig.services.inAppPurchase) {
    return undefined;
  } else {
    return new InAppPurchase2();
  }
}