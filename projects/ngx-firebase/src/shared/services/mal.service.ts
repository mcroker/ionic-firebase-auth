import { forwardRef, Inject, Injectable } from '@angular/core';
import {
    IAlertsUIProvider, ILoadingUIProvider, IToastUIProvider, MalAlertsUIProviderToken,
    MalLoadingUIProviderToken, MalToastUIProviderToken
} from '../interfaces';
import { AnalyticsService } from './analytics.service';
import { CrashlyticsService } from './crashlytics.service';
import { PerformanceService } from './performance.service';

@Injectable({ providedIn: 'root' })
export class MalService {

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

    createTrace = this.performanceService.trace;

    createLoading = this.loadingService.create.bind(this.loadingService);
    watchLoading = this.loadingService.watchObservable.bind(this.loadingService);

    constructor(
        private crashlyticsService: CrashlyticsService,
        @Inject(forwardRef(() => MalToastUIProviderToken)) private toastService: IToastUIProvider,
        private analyticsService: AnalyticsService,
        @Inject(forwardRef(() => MalAlertsUIProviderToken)) private alertService: IAlertsUIProvider,
        private performanceService: PerformanceService,
        @Inject(forwardRef(() => MalLoadingUIProviderToken)) private loadingService: ILoadingUIProvider
    ) {
    }

    logError(error: Error, messagePrefix?: string | null) {
        console.log(error);
        this.crashlyticsService.recordException(error);
        if (messagePrefix !== null) {
            this.toastService.openError(error, messagePrefix);
        }
    }

}
