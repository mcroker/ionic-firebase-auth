// Angular & Ionic
import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

// Rxjs
import { Observable } from 'rxjs';

// Capacitor
import { Plugins, StatusBarStyle, Capacitor } from '@capacitor/core';
const { CapacitorFirebaseDynamicLinks } = Plugins;

// Mal
import { RemoteConfigService, AuthProcessService, UiService, FireService } from 'ngx-firebase';

// Firebase
import { User } from '@firebase/auth-types';

// Local
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public readonly user$: Observable<User | null> = this.aps.user$;
  public readonly showRegister$: Observable<boolean> = this.aps.canRegister$;
  public readonly showLogin$: Observable<boolean> = this.aps.canSignIn$;
  public readonly showSignOut$: Observable<boolean> = this.aps.canSignOut$;
  public readonly canEdit$: Observable<boolean> = this.aps.canEdit$;

  public readonly enableAnimations: boolean = !environment.e2eAutomation;

  public readonly privacyUrl = environment.uri.privacyUrl;
  public readonly tosUrl = environment.uri.tosUrl;

  constructor(
    private platform: Platform,
    private aps: AuthProcessService,
    private navController: NavController,
    private remoteConfig: RemoteConfigService,
    private route: ActivatedRoute,
    // private profilePopover: AuthUIProfilePopoverService,
    private mal: UiService, FireService
  ) {
    this.initializeApp();
  }

  /**
   * If the current user has created classes then require/trigger merge
   */
  async doLogin() {
    try {
      await this.navController.navigateForward('/auth/signin');
    } catch (error) {
      this.mal.recordException(error);
    }
  }

  async doSignOut() {
    try {
      await this.aps.signOut();
      await this.navController.navigateRoot('/');
    } catch (error) {
      this.mal.recordException(error);
    }
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      try {
        const { SplashScreen, StatusBar } = Plugins;
        if (Capacitor.isPluginAvailable('StatusBar')) {
          // StatusBar.setStyle({ style: StatusBarStyle.Light });
          StatusBar.setStyle({ style: StatusBarStyle.Dark });
          StatusBar.show();
        }
        if (Capacitor.isPluginAvailable('SplashScreen')) {
          SplashScreen.hide();
        }
        if (Capacitor.platform !== 'web') {
          CapacitorFirebaseDynamicLinks.addListener('deepLinkOpen', (data: { url: string }) => {
            const slug = data.url.split(environment.uri.web).pop();
            if (slug) {
              this.mal.addLogMessage(`Deeplink slug=${slug}`);
              this.navController.navigateRoot(slug);
            }
          });
        }
      } catch (error) {
        this.mal.recordException(error);
      }
    });

  }

}
