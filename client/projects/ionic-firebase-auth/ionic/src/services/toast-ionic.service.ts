import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IToastOptions, IToastUIProvider } from 'ionic-firebase-auth';

@Injectable({ providedIn: 'root' })
export class AuthIonicToastService implements IToastUIProvider {

    constructor(
        private toastControl: ToastController,
        private translateService: TranslateService
    ) {
    }

    async createToast(message: string, options: IToastOptions = {}) {
        return await this.toastControl.create({
            message: await this.translateService.get(message, options.interpolateParams).toPromise(),
            duration: options.duration || 3000,
            position: options.position || 'middle'
        });
    }

    async toast(message: string, options: IToastOptions = {}) {
        // TODO Add OK button if duration is not set....
        const toast = await this.createToast(message, options);
        await toast.present();
        await toast.onDidDismiss();
    }

    async errorToast(error: Error, messagePrefix?: string, options: IToastOptions = {}) {
        if (messagePrefix) {
            await this.toast(`${messagePrefix}: ${error.message}`, options);
        } else {
            await this.toast(error.message, options);
        }
    }

}
