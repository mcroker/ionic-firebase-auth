import { __awaiter } from "tslib";
import { forwardRef, Inject, Injectable, NgZone, Optional } from '@angular/core';
import { AuthProcessService, FirebaseService, AuthSharedConfigToken } from 'ionic-firebase-auth';
import { Platform } from '@ionic/angular';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { IAPOptionsToken } from '../tokens';
import { IAPProductTypes } from '../interfaces';
import * as i0 from "@angular/core";
import * as i1 from "@ionic/angular";
import * as i2 from "@ionic-native/in-app-purchase-2/ngx/index";
import * as i3 from "ionic-firebase-auth";
import * as i4 from "../tokens/index";
export function slimDown(p) {
    if (Array.isArray(p)) {
        return p.map(i => slimDown(i));
    }
    else {
        return { owned: p.owned, id: p.id, canPurchase: p.canPurchase, state: p.state };
    }
}
export var ProductStates;
(function (ProductStates) {
    ProductStates["owned"] = "owned";
    ProductStates["approved"] = "approved";
    ProductStates["initiated"] = "initiated";
    ProductStates["requested"] = "requested";
    ProductStates["valid"] = "valid";
    ProductStates["registered"] = "registered";
    ProductStates["downloading"] = "downloading";
    ProductStates["downloaded"] = "downloaded";
    ProductStates["finsihed"] = "finished";
})(ProductStates || (ProductStates = {}));
export class IAPurchaseService {
    /*
    private updateProduct(p: IAPProduct) {
      const i = this.products.findIndex(item => p.id === item.id);
      this.products[i] = p;
    }
    */
    constructor(plt, store, aps, ngZone, fire, options, sharedConfig) {
        this.plt = plt;
        this.store = store;
        this.aps = aps;
        this.ngZone = ngZone;
        this.fire = fire;
        this.options = options;
        this.sharedConfig = sharedConfig;
        this.activeStates = [
            ProductStates.valid,
            ProductStates.requested,
            ProductStates.initiated,
            ProductStates.initiated,
            ProductStates.downloading,
            ProductStates.downloaded,
            ProductStates.finsihed,
            ProductStates.owned
        ];
        this._isLoading$ = new BehaviorSubject(false);
        this.isLoading$ = this._isLoading$.asObservable();
        this.isModuleEnabled = this.store && Capacitor.isNative && (false !== this.sharedConfig.services.inAppPurchase);
        this.products$ = (this.isModuleEnabled) ? this.selectAllProducts() : of([]);
        this.activeProducts$ = this.products$
            .pipe(map(products => products.filter(item => this.activeStates.includes(item.state) && item.title)));
        this.productsHeld$ = this.products$
            .pipe(map(products => products.filter(item => item.owned)));
        if (this.isModuleEnabled && this.options.validatorUrl) {
            this.plt.ready().then(() => __awaiter(this, void 0, void 0, function* () {
                this.isLoading = true;
                this.aps.user$.subscribe(user => {
                    this.store.applicationUsername = (user === null || user === void 0 ? void 0 : user.uid) || '';
                });
                this.store.validator = this.options.validatorUrl;
                /* For debug
                this.store.when('product').updated((p: IAPProduct) => {
                   console.log('C:UPDTED>', slimDown(p));
                });
                */
                this.store.when('product').approved((p) => {
                    p.verify();
                });
                this.store.error((error) => {
                    this.fire.recordException(error);
                });
                try {
                    yield this.load(this.options.products);
                }
                catch (error) {
                    this.fire.recordException(error);
                }
                finally {
                    this.isLoading = false;
                }
            }));
        }
        else {
            this.fire.addLogMessage('Not starting IAP as not a device');
            console.warn('Not starting IAP as not a device');
        }
    }
    get isLoading() { return this._isLoading$.value; }
    set isLoading(val) { this.ngZone.run(() => this._isLoading$.next(val)); }
    selectAllProducts() {
        if (this.isModuleEnabled) {
            return new Observable(subscriber => {
                this.store.ready(() => {
                    this.ngZone.run(() => {
                        subscriber.next(this.store.products);
                    });
                });
                this.store.when('product').updated((p) => {
                    this.ngZone.run(() => {
                        subscriber.next(this.store.products);
                    });
                });
            });
        }
        else {
            return of([]);
        }
    }
    selectProduct(product) {
        if (this.isModuleEnabled) {
            return new Observable(subscriber => {
                this.store.when(product).registered((p) => {
                    this.ngZone.run(() => {
                        subscriber.next(p);
                    });
                });
                this.store.when(product).updated((p) => {
                    this.ngZone.run(() => {
                        subscriber.next(p);
                    });
                });
            });
        }
        else {
            return of();
        }
    }
    selectIsOwned(product) {
        return this.selectProduct(product)
            .pipe(map(p => p.owned), distinctUntilChanged());
    }
    selectVerified(product = 'product') {
        if (this.isModuleEnabled) {
            return new Observable(subscriber => {
                this.store.when(product).verified((p) => {
                    this.ngZone.run(() => {
                        subscriber.next(p);
                    });
                });
            });
        }
        else {
            return of();
        }
    }
    selectOwned(product = 'product') {
        if (this.isModuleEnabled) {
            return new Observable(subscriber => {
                this.store.when(product).owned((p) => {
                    this.ngZone.run(() => {
                        subscriber.next(p);
                    });
                });
            });
        }
        else {
            return of();
        }
    }
    load(products) {
        return new Promise((resolve, reject) => {
            try {
                this.fire.addLogMessage('Error registering products');
                this.store.register(products.map(item => {
                    let type;
                    switch (item.type) {
                        case IAPProductTypes.PAID_SUBSCRIPTION:
                            type = this.store.PAID_SUBSCRIPTION;
                            break;
                        default: throw new Error('Product type not recognised');
                    }
                    return Object.assign(Object.assign({}, item), { type });
                }));
            }
            catch (error) {
                this.fire.recordException(error);
            }
            this.store.ready(() => {
                // console.log('READY READY 1>', consoleDebug(this.store.products));
                resolve(this.store.products);
            });
            this.store.error((error) => {
                this.fire.recordException(error);
                reject(error);
            });
            try {
                this.fire.addLogMessage('Starting store refresh');
                this.store.refresh();
            }
            catch (error) {
                this.fire.recordException(error);
            }
        });
    }
    purchase(product, waitForOwned = true) {
        try {
            if (!this.isModuleEnabled) {
                throw new Error('IAP Module not enabled');
            }
            if (!this.store.applicationUsername) {
                throw new Error('Unable to puchase when store.applicationUsername is not set');
            }
            return new Observable(subscriber => {
                this.store.when(product).requested((p) => {
                    subscriber.next(p);
                });
                this.store.when(product).initiated((p) => {
                    subscriber.next(p);
                });
                this.store.when(product).approved((p) => {
                    subscriber.next(p);
                });
                this.store.when(product).verified((p) => __awaiter(this, void 0, void 0, function* () {
                    // console.log('P:VERIFIED>', consoleDebug(p));
                    subscriber.next(p);
                    if (!waitForOwned) {
                        subscriber.complete();
                    } // HERE WE ARE RELAIANT ON SOMETHING EXTERNAL FULLFILLING
                }));
                this.store.once(product).owned((p) => __awaiter(this, void 0, void 0, function* () {
                    // console.log('P:OWNED>', consoleDebug(p));
                    subscriber.next(p);
                    subscriber.complete();
                }));
                this.store.once(product).cancelled((p) => {
                    // console.log('P:CANCELLED>', consoleDebug(p));
                    subscriber.next(p);
                    subscriber.complete();
                });
                this.store.once(product).error((error) => {
                    this.fire.recordException(error);
                    subscriber.error(error);
                });
                this.store.order(product).then((p) => {
                    // Purchase in progress!
                }, (error) => {
                    this.fire.recordException(error);
                    subscriber.error(error);
                });
            });
        }
        catch (error) {
            this.fire.recordException(error);
            throw error;
        }
    }
    finish(product) {
        try {
            if (!this.isModuleEnabled) {
                throw new Error('IAP Module not enabled');
            }
            return new Promise((resolve, reject) => {
                this.store.once(product).owned((p) => {
                    // console.log('P:OWNED>', consoleDebug(p));
                    resolve(p);
                });
                this.store.once(product).error((error) => {
                    this.fire.recordException(error);
                    reject(error);
                });
                try {
                    this.fire.addLogMessage('Starting finsih product');
                    product.finish();
                }
                catch (error) {
                    this.fire.recordException(error);
                }
            });
        }
        catch (error) {
            this.fire.recordException(error);
        }
    }
    // To comply with AppStore rules
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isModuleEnabled) {
                try {
                    this.fire.addLogMessage('Starting store refresh');
                    yield this.store.refresh();
                }
                catch (error) {
                    this.fire.recordException(error);
                }
            }
        });
    }
}
IAPurchaseService.ɵprov = i0.ɵɵdefineInjectable({ factory: function IAPurchaseService_Factory() { return new IAPurchaseService(i0.ɵɵinject(i1.Platform), i0.ɵɵinject(i2.InAppPurchase2, 8), i0.ɵɵinject(i3.AuthProcessService), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(i3.FirebaseService), i0.ɵɵinject(i4.IAPOptionsToken), i0.ɵɵinject(i3.AuthSharedConfigToken)); }, token: IAPurchaseService, providedIn: "root" });
IAPurchaseService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
IAPurchaseService.ctorParameters = () => [
    { type: Platform },
    { type: InAppPurchase2, decorators: [{ type: Optional }] },
    { type: AuthProcessService },
    { type: NgZone },
    { type: FirebaseService },
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => IAPOptionsToken),] }] },
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => AuthSharedConfigToken),] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvaWFwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQW9CLHFCQUFxQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQWMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxlQUFlLEVBQWlDLE1BQU0sZUFBZSxDQUFDOzs7Ozs7QUFJL0UsTUFBTSxVQUFVLFFBQVEsQ0FBQyxDQUE0QjtJQUNuRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxD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ZUFBZTs0Q0FzSnZDLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDOzRDQUN4QyxNQUFNLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBdXRoUHJvY2Vzc1NlcnZpY2UsIEZpcmViYXNlU2VydmljZSwgQXV0aFNoYXJlZENvbmZpZywgQXV0aFNoYXJlZENvbmZpZ1Rva2VuIH0gZnJvbSAnaW9uaWMtZmlyZWJhc2UtYXV0aCc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bpb25pYy9hbmd1bGFyJztcbmltcG9ydCB7IEluQXBwUHVyY2hhc2UyLCBJQVBQcm9kdWN0IH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9pbi1hcHAtcHVyY2hhc2UtMi9uZ3gnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENhcGFjaXRvciB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5pbXBvcnQgeyBJQVBPcHRpb25zVG9rZW4gfSBmcm9tICcuLi90b2tlbnMnO1xuaW1wb3J0IHsgSUFQUHJvZHVjdFR5cGVzLCBJQVBPcHRpb25zLCBJQVBQcm9kdWN0T3B0aW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2xpbURvd24ocDogSUFQUHJvZHVjdFtdKTogUGFydGlhbDxJQVBQcm9kdWN0PltdO1xuZXhwb3J0IGZ1bmN0aW9uIHNsaW1Eb3duKHA6IElBUFByb2R1Y3QpOiBQYXJ0aWFsPElBUFByb2R1Y3Q+O1xuZXhwb3J0IGZ1bmN0aW9uIHNsaW1Eb3duKHA6IElBUFByb2R1Y3QgfCBJQVBQcm9kdWN0W10pOiBQYXJ0aWFsPElBUFByb2R1Y3Q+IHwgUGFydGlhbDxJQVBQcm9kdWN0PltdIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocCkpIHtcbiAgICByZXR1cm4gcC5tYXAoaSA9PiBzbGltRG93bihpKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgb3duZWQ6IHAub3duZWQsIGlkOiBwLmlkLCBjYW5QdXJjaGFzZTogcC5jYW5QdXJjaGFzZSwgc3RhdGU6IHAuc3RhdGUgfTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBQcm9kdWN0U3RhdGVzIHtcbiAgb3duZWQgPSAnb3duZWQnLFxuICBhcHByb3ZlZCA9ICdhcHByb3ZlZCcsXG4gIGluaXRpYXRlZCA9ICdpbml0aWF0ZWQnLFxuICByZXF1ZXN0ZWQgPSAncmVxdWVzdGVkJyxcbiAgdmFsaWQgPSAndmFsaWQnLFxuICByZWdpc3RlcmVkID0gJ3JlZ2lzdGVyZWQnLFxuICBkb3dubG9hZGluZyA9ICdkb3dubG9hZGluZycsXG4gIGRvd25sb2FkZWQgPSAnZG93bmxvYWRlZCcsXG4gIGZpbnNpaGVkID0gJ2ZpbmlzaGVkJ1xuXG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgSUFQdXJjaGFzZVNlcnZpY2Uge1xuXG4gIHJlYWRvbmx5IGFjdGl2ZVN0YXRlczogc3RyaW5nW10gPSBbXG4gICAgUHJvZHVjdFN0YXRlcy52YWxpZCxcbiAgICBQcm9kdWN0U3RhdGVzLnJlcXVlc3RlZCxcbiAgICBQcm9kdWN0U3RhdGVzLmluaXRpYXRlZCxcbiAgICBQcm9kdWN0U3RhdGVzLmluaXRpYXRlZCxcbiAgICBQcm9kdWN0U3RhdGVzLmRvd25sb2FkaW5nLFxuICAgIFByb2R1Y3RTdGF0ZXMuZG93bmxvYWRlZCxcbiAgICBQcm9kdWN0U3RhdGVzLmZpbnNpaGVkLFxuICAgIFByb2R1Y3RTdGF0ZXMub3duZWRcbiAgXSBhcyBzdHJpbmdbXTtcblxuICBwcml2YXRlIF9pc0xvYWRpbmckOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGlzTG9hZGluZyQgPSB0aGlzLl9pc0xvYWRpbmckLmFzT2JzZXJ2YWJsZSgpO1xuICBwdWJsaWMgZ2V0IGlzTG9hZGluZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2lzTG9hZGluZyQudmFsdWU7IH1cbiAgcHVibGljIHNldCBpc0xvYWRpbmcodmFsOiBib29sZWFuKSB7IHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLl9pc0xvYWRpbmckLm5leHQodmFsKSk7IH1cblxuICBwcml2YXRlIHJlYWRvbmx5IGlzTW9kdWxlRW5hYmxlZCA9IHRoaXMuc3RvcmUgJiYgQ2FwYWNpdG9yLmlzTmF0aXZlICYmIChmYWxzZSAhPT0gdGhpcy5zaGFyZWRDb25maWcuc2VydmljZXMuaW5BcHBQdXJjaGFzZSk7XG5cbiAgcHVibGljIHJlYWRvbmx5IHByb2R1Y3RzJDogT2JzZXJ2YWJsZTxJQVBQcm9kdWN0W10+ID0gKHRoaXMuaXNNb2R1bGVFbmFibGVkKSA/IHRoaXMuc2VsZWN0QWxsUHJvZHVjdHMoKSA6IG9mKFtdKTtcblxuICBwdWJsaWMgcmVhZG9ubHkgYWN0aXZlUHJvZHVjdHMkOiBPYnNlcnZhYmxlPElBUFByb2R1Y3RbXT4gPSB0aGlzLnByb2R1Y3RzJFxuICAgIC5waXBlKFxuICAgICAgbWFwKHByb2R1Y3RzID0+IHByb2R1Y3RzLmZpbHRlcihpdGVtID0+IHRoaXMuYWN0aXZlU3RhdGVzLmluY2x1ZGVzKGl0ZW0uc3RhdGUpICYmIGl0ZW0udGl0bGUpKVxuICAgICk7XG5cbiAgcHVibGljIHJlYWRvbmx5IHByb2R1Y3RzSGVsZCQ6IE9ic2VydmFibGU8SUFQUHJvZHVjdFtdPiA9IHRoaXMucHJvZHVjdHMkXG4gICAgLnBpcGUobWFwKHByb2R1Y3RzID0+IHByb2R1Y3RzLmZpbHRlcihpdGVtID0+IGl0ZW0ub3duZWQpKSk7XG5cbiAgc2VsZWN0QWxsUHJvZHVjdHMoKTogT2JzZXJ2YWJsZTxJQVBQcm9kdWN0W10+IHtcbiAgICBpZiAodGhpcy5pc01vZHVsZUVuYWJsZWQpIHtcbiAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxJQVBQcm9kdWN0W10+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgICB0aGlzLnN0b3JlLnJlYWR5KCgpID0+IHtcbiAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMuc3RvcmUucHJvZHVjdHMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdG9yZS53aGVuKCdwcm9kdWN0JykudXBkYXRlZCgocDogSUFQUHJvZHVjdCkgPT4ge1xuICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5zdG9yZS5wcm9kdWN0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvZihbXSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0UHJvZHVjdChwcm9kdWN0OiBzdHJpbmcgfCBJQVBQcm9kdWN0KTogT2JzZXJ2YWJsZTxJQVBQcm9kdWN0PiB7XG4gICAgaWYgKHRoaXMuaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8SUFQUHJvZHVjdD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICAgIHRoaXMuc3RvcmUud2hlbihwcm9kdWN0KS5yZWdpc3RlcmVkKChwOiBJQVBQcm9kdWN0KSA9PiB7XG4gICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RvcmUud2hlbihwcm9kdWN0KS51cGRhdGVkKChwOiBJQVBQcm9kdWN0KSA9PiB7XG4gICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9mKCk7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0SXNPd25lZChwcm9kdWN0OiBzdHJpbmcgfCBJQVBQcm9kdWN0KTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0UHJvZHVjdChwcm9kdWN0KVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcChwID0+IHAub3duZWQpLFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICApO1xuICB9XG5cbiAgc2VsZWN0VmVyaWZpZWQocHJvZHVjdDogc3RyaW5nIHwgSUFQUHJvZHVjdCA9ICdwcm9kdWN0Jyk6IE9ic2VydmFibGU8SUFQUHJvZHVjdD4ge1xuICAgIGlmICh0aGlzLmlzTW9kdWxlRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPElBUFByb2R1Y3Q+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgICB0aGlzLnN0b3JlLndoZW4ocHJvZHVjdCkudmVyaWZpZWQoKHA6IElBUFByb2R1Y3QpID0+IHtcbiAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2YoKTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3RPd25lZChwcm9kdWN0OiBzdHJpbmcgfCBJQVBQcm9kdWN0ID0gJ3Byb2R1Y3QnKTogT2JzZXJ2YWJsZTxJQVBQcm9kdWN0PiB7XG4gICAgaWYgKHRoaXMuaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8SUFQUHJvZHVjdD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICAgIHRoaXMuc3RvcmUud2hlbihwcm9kdWN0KS5vd25lZCgocDogSUFQUHJvZHVjdCkgPT4ge1xuICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvZigpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIHByaXZhdGUgdXBkYXRlUHJvZHVjdChwOiBJQVBQcm9kdWN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMucHJvZHVjdHMuZmluZEluZGV4KGl0ZW0gPT4gcC5pZCA9PT0gaXRlbS5pZCk7XG4gICAgdGhpcy5wcm9kdWN0c1tpXSA9IHA7XG4gIH1cbiAgKi9cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdDogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBzdG9yZTogSW5BcHBQdXJjaGFzZTIsXG4gICAgcHJpdmF0ZSBhcHM6IEF1dGhQcm9jZXNzU2VydmljZSxcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgZmlyZTogRmlyZWJhc2VTZXJ2aWNlLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBJQVBPcHRpb25zVG9rZW4pKSBwcml2YXRlIG9wdGlvbnM6IElBUE9wdGlvbnMsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IEF1dGhTaGFyZWRDb25maWdUb2tlbikpIHByaXZhdGUgc2hhcmVkQ29uZmlnOiBBdXRoU2hhcmVkQ29uZmlnXG4gICkge1xuICAgIGlmICh0aGlzLmlzTW9kdWxlRW5hYmxlZCAmJiB0aGlzLm9wdGlvbnMudmFsaWRhdG9yVXJsKSB7XG4gICAgICB0aGlzLnBsdC5yZWFkeSgpLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5hcHMudXNlciQuc3Vic2NyaWJlKFxuICAgICAgICAgIHVzZXIgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5hcHBsaWNhdGlvblVzZXJuYW1lID0gdXNlcj8udWlkIHx8ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0b3JlLnZhbGlkYXRvciA9IHRoaXMub3B0aW9ucy52YWxpZGF0b3JVcmw7XG5cbiAgICAgICAgLyogRm9yIGRlYnVnXG4gICAgICAgIHRoaXMuc3RvcmUud2hlbigncHJvZHVjdCcpLnVwZGF0ZWQoKHA6IElBUFByb2R1Y3QpID0+IHtcbiAgICAgICAgICAgY29uc29sZS5sb2coJ0M6VVBEVEVEPicsIHNsaW1Eb3duKHApKTtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgICAgIHRoaXMuc3RvcmUud2hlbigncHJvZHVjdCcpLmFwcHJvdmVkKChwOiBJQVBQcm9kdWN0KSA9PiB7XG4gICAgICAgICAgcC52ZXJpZnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdG9yZS5lcnJvcigoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmlyZS5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRoaXMubG9hZCh0aGlzLm9wdGlvbnMucHJvZHVjdHMpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuZmlyZS5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlyZS5hZGRMb2dNZXNzYWdlKCdOb3Qgc3RhcnRpbmcgSUFQIGFzIG5vdCBhIGRldmljZScpO1xuICAgICAgY29uc29sZS53YXJuKCdOb3Qgc3RhcnRpbmcgSUFQIGFzIG5vdCBhIGRldmljZScpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZChwcm9kdWN0czogSUFQUHJvZHVjdE9wdGlvbnNbXSk6IFByb21pc2U8SUFQUHJvZHVjdFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPElBUFByb2R1Y3RbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5maXJlLmFkZExvZ01lc3NhZ2UoJ0Vycm9yIHJlZ2lzdGVyaW5nIHByb2R1Y3RzJyk7XG4gICAgICAgIHRoaXMuc3RvcmUucmVnaXN0ZXIocHJvZHVjdHMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIGxldCB0eXBlOiBzdHJpbmc7XG4gICAgICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSUFQUHJvZHVjdFR5cGVzLlBBSURfU1VCU0NSSVBUSU9OOiB0eXBlID0gdGhpcy5zdG9yZS5QQUlEX1NVQlNDUklQVElPTjsgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ1Byb2R1Y3QgdHlwZSBub3QgcmVjb2duaXNlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICB9O1xuICAgICAgICB9KSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLmZpcmUucmVjb3JkRXhjZXB0aW9uKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdG9yZS5yZWFkeSgoKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdSRUFEWSBSRUFEWSAxPicsIGNvbnNvbGVEZWJ1Zyh0aGlzLnN0b3JlLnByb2R1Y3RzKSk7XG4gICAgICAgIHJlc29sdmUodGhpcy5zdG9yZS5wcm9kdWN0cyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zdG9yZS5lcnJvcigoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLmZpcmUucmVjb3JkRXhjZXB0aW9uKGVycm9yKTtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmZpcmUuYWRkTG9nTWVzc2FnZSgnU3RhcnRpbmcgc3RvcmUgcmVmcmVzaCcpO1xuICAgICAgICB0aGlzLnN0b3JlLnJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuZmlyZS5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBwdXJjaGFzZShwcm9kdWN0OiBJQVBQcm9kdWN0IHwgc3RyaW5nLCB3YWl0Rm9yT3duZWQgPSB0cnVlKTogT2JzZXJ2YWJsZTxJQVBQcm9kdWN0PiB7XG4gICAgdHJ5IHtcblxuICAgICAgaWYgKCF0aGlzLmlzTW9kdWxlRW5hYmxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lBUCBNb2R1bGUgbm90IGVuYWJsZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5zdG9yZS5hcHBsaWNhdGlvblVzZXJuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHB1Y2hhc2Ugd2hlbiBzdG9yZS5hcHBsaWNhdGlvblVzZXJuYW1lIGlzIG5vdCBzZXQnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxJQVBQcm9kdWN0PihzdWJzY3JpYmVyID0+IHtcbiAgICAgICAgdGhpcy5zdG9yZS53aGVuKHByb2R1Y3QpLnJlcXVlc3RlZCgocDogSUFQUHJvZHVjdCkgPT4ge1xuICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RvcmUud2hlbihwcm9kdWN0KS5pbml0aWF0ZWQoKHA6IElBUFByb2R1Y3QpID0+IHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0b3JlLndoZW4ocHJvZHVjdCkuYXBwcm92ZWQoKHA6IElBUFByb2R1Y3QpID0+IHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0b3JlLndoZW4ocHJvZHVjdCkudmVyaWZpZWQoYXN5bmMgKHA6IElBUFByb2R1Y3QpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUDpWRVJJRklFRD4nLCBjb25zb2xlRGVidWcocCkpO1xuICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwKTtcbiAgICAgICAgICBpZiAoIXdhaXRGb3JPd25lZCkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gLy8gSEVSRSBXRSBBUkUgUkVMQUlBTlQgT04gU09NRVRISU5HIEVYVEVSTkFMIEZVTExGSUxMSU5HXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0b3JlLm9uY2UocHJvZHVjdCkub3duZWQoYXN5bmMgKHA6IElBUFByb2R1Y3QpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUDpPV05FRD4nLCBjb25zb2xlRGVidWcocCkpO1xuICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwKTtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0b3JlLm9uY2UocHJvZHVjdCkuY2FuY2VsbGVkKChwOiBJQVBQcm9kdWN0KSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ1A6Q0FOQ0VMTEVEPicsIGNvbnNvbGVEZWJ1ZyhwKSk7XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHApO1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RvcmUub25jZShwcm9kdWN0KS5lcnJvcigoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmlyZS5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdG9yZS5vcmRlcihwcm9kdWN0KS50aGVuKChwOiBhbnkpID0+IHtcbiAgICAgICAgICAvLyBQdXJjaGFzZSBpbiBwcm9ncmVzcyFcbiAgICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpcmUucmVjb3JkRXhjZXB0aW9uKGVycm9yKTtcbiAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5maXJlLnJlY29yZEV4Y2VwdGlvbihlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBmaW5pc2gocHJvZHVjdDogSUFQUHJvZHVjdCk6IFByb21pc2U8SUFQUHJvZHVjdD4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSUFQIE1vZHVsZSBub3QgZW5hYmxlZCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPElBUFByb2R1Y3Q+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5zdG9yZS5vbmNlKHByb2R1Y3QpLm93bmVkKChwOiBJQVBQcm9kdWN0KSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ1A6T1dORUQ+JywgY29uc29sZURlYnVnKHApKTtcbiAgICAgICAgICByZXNvbHZlKHApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdG9yZS5vbmNlKHByb2R1Y3QpLmVycm9yKChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maXJlLnJlY29yZEV4Y2VwdGlvbihlcnJvcik7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5maXJlLmFkZExvZ01lc3NhZ2UoJ1N0YXJ0aW5nIGZpbnNpaCBwcm9kdWN0Jyk7XG4gICAgICAgICAgcHJvZHVjdC5maW5pc2goKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmZpcmUucmVjb3JkRXhjZXB0aW9uKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZmlyZS5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRvIGNvbXBseSB3aXRoIEFwcFN0b3JlIHJ1bGVzXG4gIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgaWYgKHRoaXMuaXNNb2R1bGVFbmFibGVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmZpcmUuYWRkTG9nTWVzc2FnZSgnU3RhcnRpbmcgc3RvcmUgcmVmcmVzaCcpO1xuICAgICAgICBhd2FpdCB0aGlzLnN0b3JlLnJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuZmlyZS5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG4iXX0=