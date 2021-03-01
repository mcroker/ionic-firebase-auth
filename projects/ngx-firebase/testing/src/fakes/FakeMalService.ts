import { MalService } from 'ngx-firebase';
import { FakeCrashlyticsService } from './FakeCrashyticsService';
import { FakeToastService } from './FakeToastService';
import { FakeAnalyticsService } from './FakeAnalyticsService';
import { FakeAlertsService } from './FakeAlertsService';
import { FakePerformanceService } from './FakePerformanceService';
import { FakeLoadingService } from './FakeLoadingService';

export class FakeMalService {

    private crashlyticsService: FakeCrashlyticsService = FakeCrashlyticsService.create();
    private toastService: FakeToastService = FakeToastService.create();
    private analyticsService: FakeAnalyticsService = FakeAnalyticsService.create();
    private alertService: FakeAlertsService = FakeAlertsService.create();
    private performanceService: FakePerformanceService = FakePerformanceService.create();
    private loadingService: FakeLoadingService = FakeLoadingService.create();

    logError = jasmine.createSpy<(error: Error, message?: string | null) => void>('logError');

    recordException = this.crashlyticsService.recordException.bind(this.crashlyticsService);
    addLogMessage = this.crashlyticsService.addLogMessage.bind(this.crashlyticsService);

    toast = this.toastService.open.bind(this.toastService);
    createToast = this.toastService.create.bind(this.toastService);

    setScreenName = this.analyticsService.setScreenName.bind(this.analyticsService);
    logEvent = this.analyticsService.logEvent.bind(this.analyticsService);

    okAlert = this.alertService.okAlert.bind(this.alertService);
    infoAlert = this.alertService.infoAlert.bind(this.alertService);
    errorAlert = this.alertService.errorAlert.bind(this.alertService);
    textboxInputAlert = this.alertService.textboxInputAlert.bind(this.alertService);
    yesNoAlert = this.alertService.yesNoAlert.bind(this.alertService);

    createTrace = this.performanceService.trace.bind(this.performanceService);

    createLoading = this.loadingService.create.bind(this.loadingService);
    watchLoading = this.loadingService.watchObservable.bind(this.loadingService);

    static create(): FakeMalService & MalService {
        return new FakeMalService() as any as FakeMalService & MalService;
    }

    constructor(
    ) {
    }

}
