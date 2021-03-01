import { forwardRef, Inject, Injectable, Optional } from '@angular/core';
import { IAnalyticsProvider } from '../interfaces/providers.interface';
import { MalAnalyticsProviderToken } from '../interfaces/tokens';

@Injectable()
export class AnalyticsService implements IAnalyticsProvider {

    // Analytics NoOp
    logEvent = async (name: string, params?: { [key: string]: any }) => { console.log('NotLogged:LogEvent ' + name, params); };
    setScreenName = (screenName: string, screenClass?: string) => Promise.resolve();
    setUserId = (userId: string | null) => { };

    constructor(
        @Optional() @Inject(forwardRef(() => MalAnalyticsProviderToken)) private analytics: IAnalyticsProvider
    ) {
        if (this.analytics) {
            this.logEvent = this.analytics.logEvent;
            this.setScreenName = this.analytics.setScreenName;
            this.setUserId = this.analytics.setUserId;
        }
    }

}
