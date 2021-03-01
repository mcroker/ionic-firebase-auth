import { Injectable } from '@angular/core';
import { IFirebaseProvider } from '../interfaces';
import { AnalyticsService } from './analytics.service';
import { CrashlyticsService } from './crashlytics.service';
import { PerformanceService } from './performance.service';

@Injectable({ providedIn: 'root' })
export class FirebaseService implements IFirebaseProvider {

    recordException = this.crashlyticsService.recordException.bind(this.crashlyticsService);
    addLogMessage = this.crashlyticsService.addLogMessage.bind(this.crashlyticsService);

    setScreenName = this.analyticsService.setScreenName.bind(this.analyticsService);
    logEvent = this.analyticsService.logEvent.bind(this.analyticsService);

    createTrace = this.performanceService.createTrace;

    constructor(
        private crashlyticsService: CrashlyticsService,
        private analyticsService: AnalyticsService,
        private performanceService: PerformanceService
    ) {
    }

    async setUserId(userId: string | null) {
        this.analyticsService.setUserId(userId);
        this.crashlyticsService.setUserId(userId);
    }

}
