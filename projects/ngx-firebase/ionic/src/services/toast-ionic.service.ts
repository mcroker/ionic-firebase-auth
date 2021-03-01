import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IToastOptions, IToastUIProvider } from 'ngx-firebase';

@Injectable({ providedIn: 'root' })
export class MalIonicToastService implements IToastUIProvider {

    constructor(
        private toastControl: ToastController,
        private translateService: TranslateService
    ) {
    }

    async create(message: string, options: IToastOptions = {}) {
        return await this.toastControl.create({
            message: await this.translateService.get(message, options.interpolateParams).toPromise(),
            duration: options.duration || 3000,
            position: options.position || 'middle'
        });
    }

    async open(message: string, options: IToastOptions = {}) {
        // TODO Add OK button if duration is not set....
        const toast = await this.create(message, options);
        await toast.present();
        await toast.onDidDismiss();
    }

    async openError(error: Error, messagePrefix?: string, options: IToastOptions = {}) {
        if (messagePrefix) {
            await this.open(`${messagePrefix}: ${error.message}`, options);
        } else {
            await this.open(error.message, options);
        }
    }

}
