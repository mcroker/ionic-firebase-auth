import { Component, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PopoverController } from '@ionic/angular';
import { LinkMenuItem, AuthPopoverMenuComponent } from '../popover-menu';
import { AuthProcessService, UiService, FirebaseService, AuthSharedConfigToken, AuthSharedConfig } from 'ionic-firebase-auth';

@Component({
  selector: 'auth-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AuthAvatarComponent {

  @Input()
  canLogout = this.config.authUi.allowAccountLogout;

  @Input()
  links: LinkMenuItem[] = [];

  @Input()
  canViewAccount = this.config.authUi.allowAccountEdit;

  /*
  @Input()
  canDeleteAccount = true;

  @Input()
  canEditAccount = true;
  */

  @Input()
  showIfAnon = this.config.authUi.avatarShowIfAnon;

  @Output()
  showProfileDialog: EventEmitter<any> = new EventEmitter<any>();

  // tslint:disable-next-line no-output-on-prefix
  @Output()
  onSignOut: EventEmitter<void> = new EventEmitter();

  user$: Observable<User | null> = this.aps.user$
    .pipe(
      map(user => ((null !== user && (this.showIfAnon || !user.isAnonymous)) ? user : null)),
    );

  displayNameInitials$: Observable<string> = this.user$
    .pipe(
      map(user => {
        if (!user || !user.displayName) {
          return '';
        }
        const initialsRegExp: RegExpMatchArray = user.displayName.match(/\b\w/g) || [];
        const initials = ((initialsRegExp.shift() || '') + (initialsRegExp.pop() || '')).toUpperCase();
        return initials || '';
      })
    );

  constructor(
    public aps: AuthProcessService,
    private popoverController: PopoverController,
    private ui: UiService,
    private fire: FirebaseService,
    @Inject(forwardRef(() => AuthSharedConfigToken)) public config: AuthSharedConfig,
  ) {
  }

  openAvatarMenu(ev: any): Promise<void> {
    return new Promise<void>(async resolve => {
      const popover = await this.popoverController.create({
        component: AuthPopoverMenuComponent,
        componentProps: {
          links: [
            ...(this.canViewAccount) ? [{ text: 'auth.menu.profile', callback: this.doShowProfile.bind(this) }] : [],
            ...(this.canLogout) ? [{ text: 'auth.menu.signOut', callback: this.signOut.bind(this) }] : []
          ]
        },
        event: ev,
        translucent: true
      });
      popover.onDidDismiss().then(
        data => {
          resolve();
        }
      );
      popover.present();
    });
  }

  async doShowProfile(ev: any): Promise<void> {
    this.showProfileDialog.emit(ev);
    this.aps.showProfileDialog.emit(ev);
  }

  async signOut() {
    try {
      this.fire.addLogMessage('Starting signOut');
      await this.aps.signOut();
      // Sign-out successful.
      this.onSignOut.emit();
    } catch (error) {
      this.ui.logError(error);
    }
  }

}
