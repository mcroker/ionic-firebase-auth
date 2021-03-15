import { forwardRef, Inject, Injectable, NgZone, Optional } from '@angular/core';
import { AuthProcessService, FirebaseService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { Platform } from '@ionic/angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { MalIAPOptionsToken } from '../tokens';
import { IAPProductTypes, MalIAPOptions, MalIAPProductOptions } from '../interfaces';

export function slimDown(p: IAPProduct[]): Partial<IAPProduct>[];
export function slimDown(p: IAPProduct): Partial<IAPProduct>;
export function slimDown(p: IAPProduct | IAPProduct[]): Partial<IAPProduct> | Partial<IAPProduct>[] {
  if (Array.isArray(p)) {
    return p.map(i => slimDown(i));
  } else {
    return { owned: p.owned, id: p.id, canPurchase: p.canPurchase, state: p.state };
  }
}

export enum ProductStates {
  owned = 'owned',
  approved = 'approved',
  initiated = 'initiated',
  requested = 'requested',
  valid = 'valid',
  registered = 'registered',
  downloading = 'downloading',
  downloaded = 'downloaded',
  finsihed = 'finished'

}

@Injectable({ providedIn: 'root' })
export class IAPurchaseService {

  readonly activeStates: string[] = [
    ProductStates.valid,
    ProductStates.requested,
    ProductStates.initiated,
    ProductStates.initiated,
    ProductStates.downloading,
    ProductStates.downloaded,
    ProductStates.finsihed,
    ProductStates.owned
  ] as string[];

  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading$.asObservable();
  public get isLoading(): boolean { return this._isLoading$.value; }
  public set isLoading(val: boolean) { this.ngZone.run(() => this._isLoading$.next(val)); }

  private readonly isModuleEnabled = this.store && Capacitor.isNative && (false !== this.sharedConfig.services.inAppPurchase);

  public readonly products$: Observable<IAPProduct[]> = (this.isModuleEnabled) ? this.selectAllProducts() : of([]);

  public readonly activeProducts$: Observable<IAPProduct[]> = this.products$
    .pipe(
      map(products => products.filter(item => this.activeStates.includes(item.state) && item.title))
    );

  public readonly productsHeld$: Observable<IAPProduct[]> = this.products$
    .pipe(map(products => products.filter(item => item.owned)));

  selectAllProducts(): Observable<IAPProduct[]> {
    if (this.isModuleEnabled) {
      return new Observable<IAPProduct[]>(subscriber => {
        this.store.ready(() => {
          this.ngZone.run(() => {
            subscriber.next(this.store.products);
          });
        });
        this.store.when('product').updated((p: IAPProduct) => {
          this.ngZone.run(() => {
            subscriber.next(this.store.products);
          });
        });
      });
    } else {
      return of([]);
    }
  }

  selectProduct(product: string | IAPProduct): Observable<IAPProduct> {
    if (this.isModuleEnabled) {
      return new Observable<IAPProduct>(subscriber => {
        this.store.when(product).registered((p: IAPProduct) => {
          this.ngZone.run(() => {
            subscriber.next(p);
          });
        });
        this.store.when(product).updated((p: IAPProduct) => {
          this.ngZone.run(() => {
            subscriber.next(p);
          });
        });
      });
    } else {
      return of();
    }
  }

  selectIsOwned(product: string | IAPProduct): Observable<boolean> {
    return this.selectProduct(product)
      .pipe(
        map(p => p.owned),
        distinctUntilChanged()
      );
  }

  selectVerified(product: string | IAPProduct = 'product'): Observable<IAPProduct> {
    if (this.isModuleEnabled) {
      return new Observable<IAPProduct>(subscriber => {
        this.store.when(product).verified((p: IAPProduct) => {
          this.ngZone.run(() => {
            subscriber.next(p);
          });
        });
      });
    } else {
      return of();
    }
  }

  selectOwned(product: string | IAPProduct = 'product'): Observable<IAPProduct> {
    if (this.isModuleEnabled) {
      return new Observable<IAPProduct>(subscriber => {
        this.store.when(product).owned((p: IAPProduct) => {
          this.ngZone.run(() => {
            subscriber.next(p);
          });
        });
      });
    } else {
      return of();
    }
  }

  /*
  private updateProduct(p: IAPProduct) {
    const i = this.products.findIndex(item => p.id === item.id);
    this.products[i] = p;
  }
  */

  constructor(
    private plt: Platform,
    @Optional() private store: InAppPurchase2,
    private aps: AuthProcessService,
    private ngZone: NgZone,
    private fire: FirebaseService,
    @Inject(forwardRef(() => MalIAPOptionsToken)) private options: MalIAPOptions,
    @Inject(forwardRef(() => MalSharedConfigToken)) private sharedConfig: MalSharedConfig
  ) {
    if (this.isModuleEnabled && this.options.validatorUrl) {
      this.plt.ready().then(async () => {
        this.isLoading = true;

        this.aps.user$.subscribe(
          user => {
            this.store.applicationUsername = user?.uid || '';
          }
        );

        this.store.validator = this.options.validatorUrl;

        /* For debug
        this.store.when('product').updated((p: IAPProduct) => {
           console.log('C:UPDTED>', slimDown(p));
        });
        */
        this.store.when('product').approved((p: IAPProduct) => {
          p.verify();
        });

        this.store.error((error: any) => {
          this.fire.recordException(error);
        });

        try {
          await this.load(this.options.products);
        } catch (error) {
          this.fire.recordException(error);
        } finally {
          this.isLoading = false;
        }

      });
    } else {
      this.fire.addLogMessage('Not starting IAP as not a device');
      console.warn('Not starting IAP as not a device');
    }
  }

  private load(products: MalIAPProductOptions[]): Promise<IAPProduct[]> {
    return new Promise<IAPProduct[]>((resolve, reject) => {
      try {
        this.fire.addLogMessage('Error registering products');
        this.store.register(products.map(item => {
          let type: string;
          switch (item.type) {
            case IAPProductTypes.PAID_SUBSCRIPTION: type = this.store.PAID_SUBSCRIPTION; break;
            default: throw new Error('Product type not recognised');
          }
          return {
            ...item,
            type
          };
        }));
      } catch (error) {
        this.fire.recordException(error);
      }

      this.store.ready(() => {
        // console.log('READY READY 1>', consoleDebug(this.store.products));
        resolve(this.store.products);
      });

      this.store.error((error: any) => {
        this.fire.recordException(error);
        reject(error);
      });

      try {
        this.fire.addLogMessage('Starting store refresh');
        this.store.refresh();
      } catch (error) {
        this.fire.recordException(error);
      }

    });
  }

  purchase(product: IAPProduct | string, waitForOwned = true): Observable<IAPProduct> {
    try {

      if (!this.isModuleEnabled) {
        throw new Error('IAP Module not enabled');
      }
      if (!this.store.applicationUsername) {
        throw new Error('Unable to puchase when store.applicationUsername is not set');
      }
      return new Observable<IAPProduct>(subscriber => {
        this.store.when(product).requested((p: IAPProduct) => {
          subscriber.next(p);
        });
        this.store.when(product).initiated((p: IAPProduct) => {
          subscriber.next(p);
        });
        this.store.when(product).approved((p: IAPProduct) => {
          subscriber.next(p);
        });
        this.store.when(product).verified(async (p: IAPProduct) => {
          // console.log('P:VERIFIED>', consoleDebug(p));
          subscriber.next(p);
          if (!waitForOwned) {
            subscriber.complete();
          } // HERE WE ARE RELAIANT ON SOMETHING EXTERNAL FULLFILLING
        });
        this.store.once(product).owned(async (p: IAPProduct) => {
          // console.log('P:OWNED>', consoleDebug(p));
          subscriber.next(p);
          subscriber.complete();
        });
        this.store.once(product).cancelled((p: IAPProduct) => {
          // console.log('P:CANCELLED>', consoleDebug(p));
          subscriber.next(p);
          subscriber.complete();
        });
        this.store.once(product).error((error: any) => {
          this.fire.recordException(error);
          subscriber.error(error);
        });
        this.store.order(product).then((p: any) => {
          // Purchase in progress!
        }, (error: any) => {
          this.fire.recordException(error);
          subscriber.error(error);
        });
      });
    } catch (error) {
      this.fire.recordException(error);
      throw error;
    }
  }

  finish(product: IAPProduct): Promise<IAPProduct> {
    try {
      if (!this.isModuleEnabled) {
        throw new Error('IAP Module not enabled');
      }
      return new Promise<IAPProduct>((resolve, reject) => {
        this.store.once(product).owned((p: IAPProduct) => {
          // console.log('P:OWNED>', consoleDebug(p));
          resolve(p);
        });
        this.store.once(product).error((error: any) => {
          this.fire.recordException(error);
          reject(error);
        });
        try {
          this.fire.addLogMessage('Starting finsih product');
          product.finish();
        } catch (error) {
          this.fire.recordException(error);
        }
      });
    } catch (error) {
      this.fire.recordException(error);
    }
  }

  // To comply with AppStore rules
  async refresh() {
    if (this.isModuleEnabled) {
      try {
        this.fire.addLogMessage('Starting store refresh');
        await this.store.refresh();
      } catch (error) {
        this.fire.recordException(error);
      }
    }
  }

}
