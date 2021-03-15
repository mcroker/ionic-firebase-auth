import { Injectable } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IPickerServiceOptions, IPickerUIProvider } from 'ngx-firebase';

@Injectable({ providedIn: 'root' })
export class MalIonicPickerService implements IPickerUIProvider {

    constructor(
        private pickerController: PickerController,
        private translateService: TranslateService
    ) {
    }

    async picker<T>(options: IPickerServiceOptions): Promise<T | null> {
        return new Promise<T | null>(async resolve => {
            const [cancelKey, confirmKey] = [options.cancelText || 'shared.button.cancel', options.confirmText || 'shared.button.confirm'];
            const txd =
                await this.translateService.get([options.title, cancelKey, confirmKey], options.interpolateParams).toPromise();
            const picker = await this.pickerController.create({
                columns: [
                    {
                        name: txd[options.title],
                        options: options.options
                    }
                ],
                cssClass: 'pickerfix',
                buttons: [
                    { text: txd[cancelKey], role: 'cancel', handler: () => { resolve(null); } },
                    { text: txd[confirmKey], handler: (value) => { resolve(value[txd[options.title]].value); } }
                ]
            });
            await picker.present();
        });
    }

}
