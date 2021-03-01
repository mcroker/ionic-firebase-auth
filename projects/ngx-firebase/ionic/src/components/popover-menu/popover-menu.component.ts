import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MalService } from 'ngx-firebase';
import { LinkMenuItem } from './interface';

@Component({
  templateUrl: './popover-menu.component.html'
})
export class AuthPopoverMenuComponent {

  @Input()
  links: LinkMenuItem[] = [];

  constructor(
    private popoverController: PopoverController,
    private mal: MalService
  ) { }

  doLinkClick(link: LinkMenuItem) {
    try {
      this.popoverController.dismiss();
      if (link.callback) {
        link.callback();
      }
    } catch (error) {
      this.mal.logError(error);
    }
  }

}