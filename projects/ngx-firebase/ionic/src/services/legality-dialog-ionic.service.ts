import { forwardRef, Inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ILegalityDialogUIProvider, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';

@Injectable()
export class MalIonicLegalityDialogService implements ILegalityDialogUIProvider {

  constructor(
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
  }

  confirmTos(): Promise<boolean | null> {
    if (this.config.authUi.tosUrl || this.config.authUi.privacyPolicyUrl) {
      return new Promise<boolean>(async (resolve) => {

        const inputs = [];

        const tosChecked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
        const privacyChecked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

        const readMessage = await this.translate.get('auth.legal.readAndAccept').toPromise();
        let tosLink: string = '';
        let privacyLink: string = '';

        if (this.config.authUi.tosUrl) {
          const tosLabel = await this.translate.get('auth.legal.termsAndConditions').toPromise();
          inputs.push({
            id: 'tos_check',
            type: 'checkbox' as 'checkbox',
            label: tosLabel,
            checked: tosChecked$.value,
            cssClass: 'authui-checkbox-wrap',
            handler: (elem: any) => tosChecked$.next(elem.checked)
          });
          tosLink = ` <a target="_blank" href="${this.config.authUi.tosUrl}" >${tosLabel}</a> `;

        }

        if (this.config.authUi.privacyPolicyUrl) {
          const privacyLabel = await this.translate.get('auth.legal.privacyPolicy').toPromise();
          inputs.push({
            id: 'privacy_check',
            type: 'checkbox' as 'checkbox',
            label: privacyLabel,
            checked: privacyChecked$.value,
            cssClass: 'authui-checkbox-wrap',
            handler: (elem: any) => privacyChecked$.next(elem.checked)
          });
          privacyLink = ` <a target="_blank" href="${this.config.authUi.privacyPolicyUrl}" >${privacyLabel}</a> `;
        }

        const [header, subHeader, declineButton, acceptButton] =
          await this.translate.get([
            'brand.name',
            'auth.legal.subHeader',
            'auth.legal.declineButton',
            'auth.legal.acceptButton'
          ]).toPromise();
        const alert = await this.alertController.create({
          header,
          subHeader,
          message: `${readMessage}${tosLink}${privacyLink}`,
          inputs,
          buttons: [
            { text: declineButton, handler: _ => resolve(false), role: 'cancel' },
            { text: acceptButton, handler: _ => resolve(true), cssClass: 'confirm' }
          ],
        });
        await alert.present();

        const confirmBtn: HTMLIonButtonElement | null = document.querySelector('.confirm');
        if (confirmBtn === null) {
          throw new Error('QuerySelector for confirmBtn returned null');
        }
        confirmBtn.disabled = true;

        combineLatest([tosChecked$, privacyChecked$])
          .subscribe(([tosChecked, privacyChecked]) => confirmBtn.disabled = !tosChecked || !privacyChecked);

      });
    } else {
      return Promise.resolve(null);
    }
  }


}
