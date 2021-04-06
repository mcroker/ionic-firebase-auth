// @angular/*
import { NgModule } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { AuthSharedConfigToken } from 'ionic-firebase-auth';
import { IAPOptionsToken } from './tokens';
export class IAPModule {
    static forRoot(options) {
        return {
            ngModule: IAPModule,
            providers: [
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
IAPModule.decorators = [
    { type: NgModule, args: [{},] }
];
export function functionsInAppPurchase2Factory(sharedConfig) {
    if (false === sharedConfig.services.inAppPurchase) {
        return undefined;
    }
    else {
        return new InAppPurchase2();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pYXAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFvQixxQkFBcUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTlFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHM0MsTUFBTSxPQUFPLFNBQVM7SUFFcEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFtQjtRQUNoQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFNBQVM7WUFDbkIsU0FBUyxFQUNQO2dCQUNFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO2dCQUMvQztvQkFDRSxPQUFPLEVBQUUsY0FBYztvQkFDdkIsVUFBVSxFQUFFLDhCQUE4QjtvQkFDMUMsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUM7aUJBQzlCO2FBQ0Y7U0FDSixDQUFDO0lBQ0osQ0FBQzs7O1lBaEJGLFFBQVEsU0FBQyxFQUFFOztBQW9CWixNQUFNLFVBQVUsOEJBQThCLENBQUMsWUFBOEI7SUFDM0UsSUFBSSxLQUFLLEtBQUssWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDakQsT0FBTyxTQUFTLENBQUM7S0FDbEI7U0FBTTtRQUNMLE9BQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQztLQUM3QjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAYW5ndWxhci8qXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5BcHBQdXJjaGFzZTIgfSBmcm9tICdAaW9uaWMtbmF0aXZlL2luLWFwcC1wdXJjaGFzZS0yL25neCc7XG5pbXBvcnQgeyBBdXRoU2hhcmVkQ29uZmlnLCBBdXRoU2hhcmVkQ29uZmlnVG9rZW4gfSBmcm9tICdpb25pYy1maXJlYmFzZS1hdXRoJztcbmltcG9ydCB7IElBUE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSUFQT3B0aW9uc1Rva2VuIH0gZnJvbSAnLi90b2tlbnMnO1xuXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgSUFQTW9kdWxlIHtcblxuICBzdGF0aWMgZm9yUm9vdChvcHRpb25zOiBJQVBPcHRpb25zKTogTW9kdWxlV2l0aFByb3ZpZGVyczxJQVBNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IElBUE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczpcbiAgICAgICAgW1xuICAgICAgICAgIHsgcHJvdmlkZTogSUFQT3B0aW9uc1Rva2VuLCB1c2VWYWx1ZTogb3B0aW9ucyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IEluQXBwUHVyY2hhc2UyLFxuICAgICAgICAgICAgdXNlRmFjdG9yeTogZnVuY3Rpb25zSW5BcHBQdXJjaGFzZTJGYWN0b3J5LFxuICAgICAgICAgICAgZGVwczogW0F1dGhTaGFyZWRDb25maWdUb2tlbl1cbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgfTtcbiAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbnNJbkFwcFB1cmNoYXNlMkZhY3Rvcnkoc2hhcmVkQ29uZmlnOiBBdXRoU2hhcmVkQ29uZmlnKTogSW5BcHBQdXJjaGFzZTIgfCB1bmRlZmluZWQge1xuICBpZiAoZmFsc2UgPT09IHNoYXJlZENvbmZpZy5zZXJ2aWNlcy5pbkFwcFB1cmNoYXNlKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEluQXBwUHVyY2hhc2UyKCk7XG4gIH1cbn0iXX0=