import { forwardRef, Inject, Injectable } from '@angular/core';
import {
    ILegalityDialogUIProvider, MalLegaliyDialogUIProiderToken,
    IAlertsUIProvider, ILoadingUIProvider, IToastUIProvider, MalAlertsUIProviderToken,
    MalLoadingUIProviderToken, MalToastUIProviderToken
} from '../interfaces';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class UiService {

    toast = this.toastService.open.bind(this.toastService);
    createToast = this.toastService.create.bind(this.toastService);

    okAlert = this.alertService.okAlert.bind(this.alertService);
    infoAlert = this.alertService.infoAlert.bind(this.alertService);
    errorAlert = this.alertService.errorAlert.bind(this.alertService);
    textboxInputAlert = this.alertService.textboxInputAlert.bind(this.alertService);
    yesNoAlert = this.alertService.yesNoAlert.bind(this.alertService);

    createLoading = this.loadingService.create.bind(this.loadingService);
    watchLoading = this.loadingService.watchObservable.bind(this.loadingService);

    confirmTos = this.legalityDialog.confirmTos.bind(this.legalityDialog);

    constructor(
        @Inject(forwardRef(() => MalToastUIProviderToken)) private toastService: IToastUIProvider,
        @Inject(forwardRef(() => MalAlertsUIProviderToken)) private alertService: IAlertsUIProvider,
        @Inject(forwardRef(() => MalLoadingUIProviderToken)) private loadingService: ILoadingUIProvider,
        @Inject(forwardRef(() => MalLegaliyDialogUIProiderToken)) private legalityDialog: ILegalityDialogUIProvider,
        private fire: FirebaseService
    ) {
    }

    logError(error: Error, messagePrefix?: string | null) {
        console.log(error);
        this.fire.recordException(error);
        if (messagePrefix !== null) {
            this.toastService.openError(error, messagePrefix);
        }
    }

}
