// Angular & Ionic
import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

// Capacitor
import { Plugins, Capacitor } from '@capacitor/core';
import { StatusBarStyle } from '@capacitor/status-bar'
const { CapacitorFirebaseDynamicLinks } = Plugins;

// Mal
import { RemoteConfigService, AuthProcessService, UiService, FirebaseService } from 'ionic-firebase-auth';

// Local
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {


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
    private ui: UiService,
    private fire: FirebaseService
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
      this.fire.recordException(error);
    }
  }

  async doSignOut() {
    try {
      await this.aps.signOut();
      await this.navController.navigateRoot('/');
    } catch (error) {
      this.fire.recordException(error);
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
        /* if (Capacitor.platform !== 'web') {
          CapacitorFirebaseDynamicLinks.addListener('deepLinkOpen', (data: { url: string }) => {
            const slug = data.url.split(environment.uri.web).pop();
            if (slug) {
              this.fire.addLogMessage(`Deeplink slug=${slug}`);
              this.navController.navigateRoot(slug);
            }
          });
        }
        */
      } catch (error) {
        this.fire.recordException(error);
      }
    });

  }

}
