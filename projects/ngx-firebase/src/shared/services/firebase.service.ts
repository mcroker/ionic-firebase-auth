import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { CrashlyticsService } from './crashlytics.service';
import { PerformanceService } from './performance.service';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

    recordException = this.crashlyticsService.recordException.bind(this.crashlyticsService);
    addLogMessage = this.crashlyticsService.addLogMessage.bind(this.crashlyticsService);

    setScreenName = this.analyticsService.setScreenName.bind(this.analyticsService);
    logEvent = this.analyticsService.logEvent.bind(this.analyticsService);

    createTrace = this.performanceService.trace;

    constructor(
        private crashlyticsService: CrashlyticsService,
        private analyticsService: AnalyticsService,
        private performanceService: PerformanceService
    ) {
    }

}
