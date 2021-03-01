import { FirebaseService } from 'ngx-firebase';
import { FakeCrashlyticsService } from './FakeCrashyticsService';
import { FakeAnalyticsService } from './FakeAnalyticsService';
import { FakePerformanceService } from './FakePerformanceService';

export class FakeFirebaseService {

    private crashlyticsService: FakeCrashlyticsService = FakeCrashlyticsService.create();
    private analyticsService: FakeAnalyticsService = FakeAnalyticsService.create();
    private performanceService: FakePerformanceService = FakePerformanceService.create();

    recordException = this.crashlyticsService.recordException.bind(this.crashlyticsService);
    addLogMessage = this.crashlyticsService.addLogMessage.bind(this.crashlyticsService);

    setScreenName = this.analyticsService.setScreenName.bind(this.analyticsService);
    logEvent = this.analyticsService.logEvent.bind(this.analyticsService);

    createTrace = this.performanceService.trace.bind(this.performanceService);

    static create(): FakeFirebaseService & FirebaseService {
        return new FakeFirebaseService() as any as FakeFirebaseService & FirebaseService;
    }

    constructor(
    ) {
    }

}
