(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ionic-native/in-app-purchase-2/ngx'), require('ionic-firebase-auth'), require('@ionic/angular'), require('rxjs'), require('rxjs/operators'), require('@capacitor/core'), require('@ionic-native/in-app-purchase-2/ngx/index')) :
    typeof define === 'function' && define.amd ? define('ionic-firebase-iap', ['exports', '@angular/core', '@ionic-native/in-app-purchase-2/ngx', 'ionic-firebase-auth', '@ionic/angular', 'rxjs', 'rxjs/operators', '@capacitor/core', '@ionic-native/in-app-purchase-2/ngx/index'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ionic-firebase-iap'] = {}, global.ng.core, global.InAppPurchase2, global.i3, global.ionic.angular, global.rxjs, global.rxjs.operators, global.Capacitor, global.InAppPurchase2));
}(this, (function (exports, i0, ngx, i3, i1, rxjs, operators, core, i2) { 'use strict';

    // This token is the official token containing the final configuration; ie. the merge between default and user provided configurations
    var IAPOptionsToken = new i0.InjectionToken('IAPOptionsToken');

    // @angular/*
    var IAPModule = /** @class */ (function () {
        function IAPModule() {
        }
        IAPModule.forRoot = function (options) {
            return {
                ngModule: IAPModule,
                providers: [
                    { provide: IAPOptionsToken, useValue: options },
                    {
                        provide: ngx.InAppPurchase2,
                        useFactory: functionsInAppPurchase2Factory,
                        deps: [i3.AuthSharedConfigToken]
                    },
                ]
            };
        };
        return IAPModule;
    }());
    IAPModule.decorators = [
        { type: i0.NgModule, args: [{},] }
    ];
    function functionsInAppPurchase2Factory(sharedConfig) {
        if (false === sharedConfig.services.inAppPurchase) {
            return undefined;
        }
        else {
            return new ngx.InAppPurchase2();
        }
    }

    exports.IAPProductTypes = void 0;
    (function (IAPProductTypes) {
        IAPProductTypes["PAID_SUBSCRIPTION"] = "PAID_SUBSCRIPTION";
    })(exports.IAPProductTypes || (exports.IAPProductTypes = {}));

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    function slimDown(p) {
        if (Array.isArray(p)) {
            return p.map(function (i) { return slimDown(i); });
        }
        else {
            return { owned: p.owned, id: p.id, canPurchase: p.canPurchase, state: p.state };
        }
    }
    exports.ProductStates = void 0;
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
    })(exports.ProductStates || (exports.ProductStates = {}));
    var IAPurchaseService = /** @class */ (function () {
        /*
        private updateProduct(p: IAPProduct) {
          const i = this.products.findIndex(item => p.id === item.id);
          this.products[i] = p;
        }
        */
        function IAPurchaseService(plt, store, aps, ngZone, fire, options, sharedConfig) {
            var _this = this;
            this.plt = plt;
            this.store = store;
            this.aps = aps;
            this.ngZone = ngZone;
            this.fire = fire;
            this.options = options;
            this.sharedConfig = sharedConfig;
            this.activeStates = [
                exports.ProductStates.valid,
                exports.ProductStates.requested,
                exports.ProductStates.initiated,
                exports.ProductStates.initiated,
                exports.ProductStates.downloading,
                exports.ProductStates.downloaded,
                exports.ProductStates.finsihed,
                exports.ProductStates.owned
            ];
            this._isLoading$ = new rxjs.BehaviorSubject(false);
            this.isLoading$ = this._isLoading$.asObservable();
            this.isModuleEnabled = this.store && core.Capacitor.isNative && (false !== this.sharedConfig.services.inAppPurchase);
            this.products$ = (this.isModuleEnabled) ? this.selectAllProducts() : rxjs.of([]);
            this.activeProducts$ = this.products$
                .pipe(operators.map(function (products) { return products.filter(function (item) { return _this.activeStates.includes(item.state) && item.title; }); }));
            this.productsHeld$ = this.products$
                .pipe(operators.map(function (products) { return products.filter(function (item) { return item.owned; }); }));
            if (this.isModuleEnabled && this.options.validatorUrl) {
                this.plt.ready().then(function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.isLoading = true;
                                this.aps.user$.subscribe(function (user) {
                                    _this.store.applicationUsername = (user === null || user === void 0 ? void 0 : user.uid) || '';
                                });
                                this.store.validator = this.options.validatorUrl;
                                /* For debug
                                this.store.when('product').updated((p: IAPProduct) => {
                                   console.log('C:UPDTED>', slimDown(p));
                                });
                                */
                                this.store.when('product').approved(function (p) {
                                    p.verify();
                                });
                                this.store.error(function (error) {
                                    _this.fire.recordException(error);
                                });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, 4, 5]);
                                return [4 /*yield*/, this.load(this.options.products)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 3:
                                error_1 = _a.sent();
                                this.fire.recordException(error_1);
                                return [3 /*break*/, 5];
                            case 4:
                                this.isLoading = false;
                                return [7 /*endfinally*/];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                this.fire.addLogMessage('Not starting IAP as not a device');
                console.warn('Not starting IAP as not a device');
            }
        }
        Object.defineProperty(IAPurchaseService.prototype, "isLoading", {
            get: function () { return this._isLoading$.value; },
            set: function (val) {
                var _this = this;
                this.ngZone.run(function () { return _this._isLoading$.next(val); });
            },
            enumerable: false,
            configurable: true
        });
        IAPurchaseService.prototype.selectAllProducts = function () {
            var _this = this;
            if (this.isModuleEnabled) {
                return new rxjs.Observable(function (subscriber) {
                    _this.store.ready(function () {
                        _this.ngZone.run(function () {
                            subscriber.next(_this.store.products);
                        });
                    });
                    _this.store.when('product').updated(function (p) {
                        _this.ngZone.run(function () {
                            subscriber.next(_this.store.products);
                        });
                    });
                });
            }
            else {
                return rxjs.of([]);
            }
        };
        IAPurchaseService.prototype.selectProduct = function (product) {
            var _this = this;
            if (this.isModuleEnabled) {
                return new rxjs.Observable(function (subscriber) {
                    _this.store.when(product).registered(function (p) {
                        _this.ngZone.run(function () {
                            subscriber.next(p);
                        });
                    });
                    _this.store.when(product).updated(function (p) {
                        _this.ngZone.run(function () {
                            subscriber.next(p);
                        });
                    });
                });
            }
            else {
                return rxjs.of();
            }
        };
        IAPurchaseService.prototype.selectIsOwned = function (product) {
            return this.selectProduct(product)
                .pipe(operators.map(function (p) { return p.owned; }), operators.distinctUntilChanged());
        };
        IAPurchaseService.prototype.selectVerified = function (product) {
            var _this = this;
            if (product === void 0) { product = 'product'; }
            if (this.isModuleEnabled) {
                return new rxjs.Observable(function (subscriber) {
                    _this.store.when(product).verified(function (p) {
                        _this.ngZone.run(function () {
                            subscriber.next(p);
                        });
                    });
                });
            }
            else {
                return rxjs.of();
            }
        };
        IAPurchaseService.prototype.selectOwned = function (product) {
            var _this = this;
            if (product === void 0) { product = 'product'; }
            if (this.isModuleEnabled) {
                return new rxjs.Observable(function (subscriber) {
                    _this.store.when(product).owned(function (p) {
                        _this.ngZone.run(function () {
                            subscriber.next(p);
                        });
                    });
                });
            }
            else {
                return rxjs.of();
            }
        };
        IAPurchaseService.prototype.load = function (products) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try {
                    _this.fire.addLogMessage('Error registering products');
                    _this.store.register(products.map(function (item) {
                        var type;
                        switch (item.type) {
                            case exports.IAPProductTypes.PAID_SUBSCRIPTION:
                                type = _this.store.PAID_SUBSCRIPTION;
                                break;
                            default: throw new Error('Product type not recognised');
                        }
                        return Object.assign(Object.assign({}, item), { type: type });
                    }));
                }
                catch (error) {
                    _this.fire.recordException(error);
                }
                _this.store.ready(function () {
                    // console.log('READY READY 1>', consoleDebug(this.store.products));
                    resolve(_this.store.products);
                });
                _this.store.error(function (error) {
                    _this.fire.recordException(error);
                    reject(error);
                });
                try {
                    _this.fire.addLogMessage('Starting store refresh');
                    _this.store.refresh();
                }
                catch (error) {
                    _this.fire.recordException(error);
                }
            });
        };
        IAPurchaseService.prototype.purchase = function (product, waitForOwned) {
            var _this = this;
            if (waitForOwned === void 0) { waitForOwned = true; }
            try {
                if (!this.isModuleEnabled) {
                    throw new Error('IAP Module not enabled');
                }
                if (!this.store.applicationUsername) {
                    throw new Error('Unable to puchase when store.applicationUsername is not set');
                }
                return new rxjs.Observable(function (subscriber) {
                    _this.store.when(product).requested(function (p) {
                        subscriber.next(p);
                    });
                    _this.store.when(product).initiated(function (p) {
                        subscriber.next(p);
                    });
                    _this.store.when(product).approved(function (p) {
                        subscriber.next(p);
                    });
                    _this.store.when(product).verified(function (p) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // console.log('P:VERIFIED>', consoleDebug(p));
                            subscriber.next(p);
                            if (!waitForOwned) {
                                subscriber.complete();
                            } // HERE WE ARE RELAIANT ON SOMETHING EXTERNAL FULLFILLING
                            return [2 /*return*/];
                        });
                    }); });
                    _this.store.once(product).owned(function (p) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // console.log('P:OWNED>', consoleDebug(p));
                            subscriber.next(p);
                            subscriber.complete();
                            return [2 /*return*/];
                        });
                    }); });
                    _this.store.once(product).cancelled(function (p) {
                        // console.log('P:CANCELLED>', consoleDebug(p));
                        subscriber.next(p);
                        subscriber.complete();
                    });
                    _this.store.once(product).error(function (error) {
                        _this.fire.recordException(error);
                        subscriber.error(error);
                    });
                    _this.store.order(product).then(function (p) {
                        // Purchase in progress!
                    }, function (error) {
                        _this.fire.recordException(error);
                        subscriber.error(error);
                    });
                });
            }
            catch (error) {
                this.fire.recordException(error);
                throw error;
            }
        };
        IAPurchaseService.prototype.finish = function (product) {
            var _this = this;
            try {
                if (!this.isModuleEnabled) {
                    throw new Error('IAP Module not enabled');
                }
                return new Promise(function (resolve, reject) {
                    _this.store.once(product).owned(function (p) {
                        // console.log('P:OWNED>', consoleDebug(p));
                        resolve(p);
                    });
                    _this.store.once(product).error(function (error) {
                        _this.fire.recordException(error);
                        reject(error);
                    });
                    try {
                        _this.fire.addLogMessage('Starting finsih product');
                        product.finish();
                    }
                    catch (error) {
                        _this.fire.recordException(error);
                    }
                });
            }
            catch (error) {
                this.fire.recordException(error);
            }
        };
        // To comply with AppStore rules
        IAPurchaseService.prototype.refresh = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isModuleEnabled) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            this.fire.addLogMessage('Starting store refresh');
                            return [4 /*yield*/, this.store.refresh()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.fire.recordException(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return IAPurchaseService;
    }());
    IAPurchaseService.ɵprov = i0.ɵɵdefineInjectable({ factory: function IAPurchaseService_Factory() { return new IAPurchaseService(i0.ɵɵinject(i1.Platform), i0.ɵɵinject(i2.InAppPurchase2, 8), i0.ɵɵinject(i3.AuthProcessService), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(i3.FirebaseService), i0.ɵɵinject(IAPOptionsToken), i0.ɵɵinject(i3.AuthSharedConfigToken)); }, token: IAPurchaseService, providedIn: "root" });
    IAPurchaseService.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    IAPurchaseService.ctorParameters = function () { return [
        { type: i1.Platform },
        { type: ngx.InAppPurchase2, decorators: [{ type: i0.Optional }] },
        { type: i3.AuthProcessService },
        { type: i0.NgZone },
        { type: i3.FirebaseService },
        { type: undefined, decorators: [{ type: i0.Inject, args: [i0.forwardRef(function () { return IAPOptionsToken; }),] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [i0.forwardRef(function () { return i3.AuthSharedConfigToken; }),] }] }
    ]; };

    /**
     * Generated bundle index. Do not edit.
     */

    exports.IAPModule = IAPModule;
    exports.IAPOptionsToken = IAPOptionsToken;
    exports.IAPurchaseService = IAPurchaseService;
    exports.functionsInAppPurchase2Factory = functionsInAppPurchase2Factory;
    exports.slimDown = slimDown;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ionic-firebase-iap.umd.js.map
