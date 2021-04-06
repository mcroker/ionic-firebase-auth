import { InjectionToken, NgModule, ɵɵdefineInjectable, ɵɵinject, NgZone, Injectable, Optional, Inject, forwardRef } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { AuthSharedConfigToken, AuthProcessService, FirebaseService } from 'ionic-firebase-auth';
import { __awaiter } from 'tslib';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { InAppPurchase2 as InAppPurchase2$1 } from '@ionic-native/in-app-purchase-2/ngx/index';

// This token is the official token containing the final configuration; ie. the merge between default and user provided configurations
const IAPOptionsToken = new InjectionToken('IAPOptionsToken');

// @angular/*
class IAPModule {
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
function functionsInAppPurchase2Factory(sharedConfig) {
    if (false === sharedConfig.services.inAppPurchase) {
        return undefined;
    }
    else {
        return new InAppPurchase2();
    }
}

var IAPProductTypes;
(function (IAPProductTypes) {
    IAPProductTypes["PAID_SUBSCRIPTION"] = "PAID_SUBSCRIPTION";
})(IAPProductTypes || (IAPProductTypes = {}));

function slimDown(p) {
    if (Array.isArray(p)) {
        return p.map(i => slimDown(i));
    }
    else {
        return { owned: p.owned, id: p.id, canPurchase: p.canPurchase, state: p.state };
    }
}
var ProductStates;
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
class IAPurchaseService {
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
IAPurchaseService.ɵprov = ɵɵdefineInjectable({ factory: function IAPurchaseService_Factory() { return new IAPurchaseService(ɵɵinject(Platform), ɵɵinject(InAppPurchase2$1, 8), ɵɵinject(AuthProcessService), ɵɵinject(NgZone), ɵɵinject(FirebaseService), ɵɵinject(IAPOptionsToken), ɵɵinject(AuthSharedConfigToken)); }, token: IAPurchaseService, providedIn: "root" });
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

/**
 * Generated bundle index. Do not edit.
 */

export { IAPModule, IAPOptionsToken, IAPProductTypes, IAPurchaseService, ProductStates, functionsInAppPurchase2Factory, slimDown };
//# sourceMappingURL=ionic-firebase-iap.js.map
