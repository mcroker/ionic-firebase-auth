import { forwardRef, Inject, Injectable } from '@angular/core';
import {
    ILegalityDialogUIProvider, MalLegaliyDialogUIProiderToken,
    IAlertsUIProvider, ILoadingUIProvider, IToastUIProvider, MalAlertsUIProviderToken,
    MalLoadingUIProviderToken, MalToastUIProviderToken, IUIProvider
} from '../interfaces';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class UiService implements IUIProvider {

    toast = this.toastService.toast.bind(this.toastService);
    createToast = this.toastService.createToast.bind(this.toastService);
    errorToast = this.toastService.errorToast.bind(this.toastService);

    okAlert = this.alertService.okAlert.bind(this.alertService);
    infoAlert = this.alertService.infoAlert.bind(this.alertService);
    errorAlert = this.alertService.errorAlert.bind(this.alertService);
    textboxInputAlert = this.alertService.textboxInputAlert.bind(this.alertService);
    yesNoAlert = this.alertService.yesNoAlert.bind(this.alertService);

    createLoading = this.loadingService.createLoading.bind(this.loadingService);
    watchLoading = this.loadingService.watchLoading.bind(this.loadingService);

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
            this.toastService.errorToast(error, messagePrefix);
        }
    }

}
