// @angular/*
import { ModuleWithProviders, NgModule } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { MalIAPOptions } from './interfaces';
import { MalIAPOptionsToken } from './tokens';

@NgModule({})
export class MalIAPModule {

  static forRoot(options: MalIAPOptions): ModuleWithProviders<MalIAPModule> {
    return {
      ngModule: MalIAPModule,
      providers:
        [
          { provide: MalIAPOptionsToken, useValue: options },
          {
            provide: InAppPurchase2,
            useFactory: functionsInAppPurchase2Factory,
            deps: [MalSharedConfigToken]
          },
        ]
    };
  }

}

function functionsInAppPurchase2Factory(sharedConfig: MalSharedConfig): InAppPurchase2 | undefined {
  if (false === sharedConfig.services.inAppPurchase) {
    return undefined;
  } else {
    return new InAppPurchase2();
  }
}