// Angular & Inionc
import { Component, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CreateAccountFormData } from '../register-with-email/register-with-email.component';

// RxJS

// Mal
import { NgxAuthFirebaseuiAnimations } from '../../animations';


@Component({
  templateUrl: './register-with-email-popover.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUIRegisterWithEmailPopoverComponent {

  constructor(
    private popoverController:PopoverController
  ) { }

  doCreateAccountClick(data: CreateAccountFormData) {
    this.popoverController.dismiss(data);
  }

}
