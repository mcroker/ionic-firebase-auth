// Angular & Inionc
import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit,
  Output, ViewEncapsulation
} from '@angular/core';

// RxJS
import { Observable, Subject } from 'rxjs';

// Mal
import { NgxAuthFirebaseuiAnimations } from '../../animations';
import { AuthProcessService, AuthProvider, UiService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { CreateAccountFormData } from '../register-with-email/register-with-email.component';
import { PopoverController } from '@ionic/angular';

function isCreateAccountFormData(x: any): x is CreateAccountFormData {
  return x && x.email && x.password;
}

@Component({
  selector: 'mal-authui-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUIRegisterComponent implements OnDestroy, AfterViewInit {

  @Input() showEmail: 'inline' | 'popover' | 'none' = 'popover';
  @Input() providers: string[] | string = AuthProvider.ALL; //  google, facebook, twitter, github as array or all as one single string

  // Events
  // tslint:disable no-output-on-prefix
  @Output() onSuccess: EventEmitter<any> = this.aps.onRegisterEmitter;
  @Output() onError: EventEmitter<any> = this.aps.onErrorEmitter;
  @Output() onLoginRequested: EventEmitter<void> = new EventEmitter<void>();
  // tslint:enable no-output-on-prefix

  // Prevent somebody already logged in as guest - relogging in as gyest
  guestEnabled$: Observable<boolean> = this.aps.canSignInAsGuest$;

  // Private
  private destroy$: Subject<void> = new Subject<void>();

  // tslint:disable-next-line @typescript-eslint/ban-types
  constructor(
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    public aps: AuthProcessService,
    private ui: UiService,
    private popover: PopoverController,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async doCreateAccount(data: CreateAccountFormData): Promise<void> {
    try {
      this.changeDetectorRef.markForCheck();
      await this.aps.registerWith(
        AuthProvider.EmailAndPassword,
        {
          credentials: {
            email: data.email,
            password: data.password
          },
          displayName: data.name,
          skipTosCheck: true
        }
      );
    } catch (error) {
      this.ui.logError(error);
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  async doRegisterAnonymously() {
    try {
      this.changeDetectorRef.markForCheck();
      await this.aps.signInWith(AuthProvider.ANONYMOUS);
    } catch (error) {
      this.ui.logError(error);
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  async doRegisterWithEmailPopover() {
    try {
      const data = await new Promise<CreateAccountFormData | null>(
        async (resolve, reject) => {
          try {
            const { AuthUIRegisterWithEmailPopoverComponent } = await import('../register-with-email-popover/register-with-email-popover.component');
            const popover = await this.popover.create({
              component: AuthUIRegisterWithEmailPopoverComponent,
              cssClass: ['wide-popover', 'dark-backdrop']
            })
            popover.onDidDismiss().then((resp: any) => {
              if (isCreateAccountFormData(resp?.data)) {
                resolve(resp.data);
              } else {
                resolve(null);
              }
            });
            await popover.present();
          } catch (error) {
            this.ui.logError(error);
            reject(error);
          }
        }
      );
      if (data) {
        await this.doCreateAccount(data);
      }
    } catch (error) {
      this.ui.logError(error);
    }
  }

  doProviderClick(provider: AuthProvider) {
    try {
      this.aps.registerWith(provider);
    } catch (error) {
      this.ui.logError(error);
    }
  }

}
