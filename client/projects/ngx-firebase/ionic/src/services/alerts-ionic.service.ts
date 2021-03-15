import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IYesNoAlertOptions, IOkAlertOptions, ITextAlertOptions, IAlertsUIProvider } from 'ngx-firebase';

@Injectable({ providedIn: 'root' })
export class MalIonicAlertsService implements IAlertsUIProvider {

  constructor(
    private alertController: AlertController,
    private translateService: TranslateService
  ) { }

  yesNoAlert(message: string, options: IYesNoAlertOptions = {}): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      const [headerKey, subheaderKey] = [options.header || 'brand.name', options.subHeader || 'subHeader'];
      const txd = await this.translateService.get(
        [headerKey, subheaderKey, message, 'shared.button.no', 'shared.button.yes'],
        options.interpolateParams
      ).toPromise();

      const noButton = {
        text: txd['shared.button.no'],
        role: 'cancel',
        handler: () => resolve(false)
      };

      const yesButton = {
        text: txd['shared.button.yes'],
        handler: () => resolve(true)
      }

      const alert = await this.alertController.create({
        header: txd[headerKey],
        subHeader: (options?.subHeader) ? txd[subheaderKey] : undefined,
        message: txd[message],
        buttons: [
          (options?.defaultToNo) ? yesButton : noButton,
          (options?.defaultToNo) ? noButton : yesButton
        ]
      });
      await alert.present();
    });
  }

  okAlert(message: string, options: IOkAlertOptions = {}): Promise<void> {
    return new Promise<void>(async resolve => {
      const [headerKey, subheaderKey] = [options.header || 'brand.name', options.subHeader || 'subHeader'];
      const txd = await this.translateService.get(
        [headerKey, subheaderKey, message, 'shared.button.ok'],
        options.interpolateParams
      ).toPromise();

      const alert = await this.alertController.create({
        header: txd[headerKey],
        subHeader: (options.subHeader) ? txd[subheaderKey] : undefined,
        message: txd[message],
        buttons: [txd['shared.button.ok']]
      });
      alert.onDidDismiss().then(() => resolve());
      await alert.present();
    });
  }

  errorAlert(message: string, options: IOkAlertOptions = {}): Promise<void> {
    return this.okAlert(message, options);
  }

  infoAlert(message: string, options: IOkAlertOptions = {}): Promise<void> {
    return this.okAlert(message, options);
  }

  textboxInputAlert(options: ITextAlertOptions): Promise<string | null> {
    return new Promise(async (resolve) => {

      const [headerKey, subheaderKey, okKey, placeholderKey] = [
        options.header || 'brand.name',
        options.subHeader || 'subHeader',
        options.okText || 'shared.button.ok',
        options.placeholder || 'placeHolder'
      ];
      const txd = await this.translateService.get(
        [headerKey, subheaderKey, 'shared.button.cancel', okKey, placeholderKey],
        options.interpolateParams
      ).toPromise();

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: txd[headerKey],
        subHeader: (options.subHeader) ? txd[subheaderKey] : undefined,
        inputs: [
          {
            name: 'textField',
            type: 'text',
            value: options.value,
            placeholder: txd[placeholderKey],
          }
        ],
        buttons: [
          {
            text: txd['shared.button.cancel'],
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(null);
            }
          }, {
            text: txd[okKey],
            handler: (data) => {
              resolve(data.textField);
            }
          }
        ]
      });
      await alert.present();
    });
  }


}
