import { Injectable, Optional, forwardRef, Inject } from '@angular/core';

import { AndroidException, ICrashlyticsProvider, iOSException } from '../interfaces';
import { MalCrashlyticsProviderToken } from '../interfaces/tokens';

@Injectable()
export class CrashlyticsService implements ICrashlyticsProvider {

    // Crashlyitcs
    private _recordException = (_options: iOSException | AndroidException) => Promise.resolve();
    private _addLogMessage = (message: string) => Promise.resolve();
    private _setUserId = (uid: string | null) => {};

    constructor(
        @Optional() @Inject(forwardRef(() => MalCrashlyticsProviderToken)) private crashlyticsProvider: ICrashlyticsProvider,
    ) {
        if (this.crashlyticsProvider) {
            this._recordException = this.crashlyticsProvider.recordException;
            this._addLogMessage = this.crashlyticsProvider.addLogMessage;
        }
    }

    setUserId(uid: string | null) {
        this._setUserId(uid);
    }

    recordException(options: string | iOSException | AndroidException | Error): Promise<void> {
        let e: iOSException | AndroidException = { message: 'An unknown error occured' };
        if ('string' === typeof options) {
            e.message = options;
        } else if (options instanceof Error) {
            e.message = options.message;
        } else if (e.message) {
            e = options;
        }
        return this._recordException(e);
    }

    addLogMessage(message: string): Promise<void> {
        console.log('addLogMessage ' + message);
        return this._addLogMessage(message);
    }

}
