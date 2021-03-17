import { forwardRef, Inject, Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import 'firebase/auth';
import { AuthCredential } from '@firebase/auth-types';
if (!firebase.auth) {
  throw new Error('firebase.auth is undefined');
}
import { GoogleSignInResult, FacebookSignInResult, TwitterSignInResult, AppleSignInResult } from 'capacitor-firebase-auth';
import { Plugins, Capacitor, Device, PluginListenerHandle, WebPluginRegistry } from '@capacitor/core';
import { AuthProvider, ICredentialFactoryProvider, FirebaseService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { MalCapacitorConfig, MalCapacitorConfigToken } from '../interfaces';
import { v4 as uuid } from 'uuid';
import { sha256 } from 'js-sha256';

WebPluginRegistry

const { Browser, CapacitorFirebaseDynamicLinks, CapacitorFirebaseAuth } = Plugins;
const fireAuth = firebase.auth;

@Injectable({
  providedIn: 'root'
})
export class AuthCredentialFactoryCapacitorService implements ICredentialFactoryProvider {

  /**
 * Returns true if current platform is webplatform supported by @angular/fire
 */
  get isWebPlatform(): boolean {
    return ['https:', 'http:', 'chrome-extension'].includes(location.protocol);
  }

  constructor(
    private fire: FirebaseService,
    @Inject(forwardRef(() => MalSharedConfigToken)) public sharedConfig: MalSharedConfig,
    @Inject(forwardRef(() => MalCapacitorConfigToken)) public capConfg: MalCapacitorConfig,
  ) {
  }

  private async deviceSupportsNativeApple(): Promise<boolean> {
    const deviceInfo = await Device.getInfo();
    const osMajor = parseInt(deviceInfo.osVersion.split('.')[0], 10);
    if (osMajor >= 13 && Capacitor.platform === 'ios') {
      return true
    } else if (Capacitor.platform === 'ios') {
      console.warn('Disabling native-support for signInWithApple as iOS version < 13');
    }
    return false;
  }

  public async isProviderSupported(provider: AuthProvider): Promise<boolean> {
    if (this.isWebPlatform) {
      return false;
    }
    switch (provider) {
      case AuthProvider.Apple:
        return !!this.capConfg.signInWithApple || (await this.deviceSupportsNativeApple() && Capacitor.isPluginAvailable('CapacitorFirebaseAuth'));

      case AuthProvider.Google:
      case AuthProvider.Facebook:
      case AuthProvider.Twitter:
        return Capacitor.isPluginAvailable('CapacitorFirebaseAuth');

      default:
        return false;
    }
  }

  public async getCredential(provider: AuthProvider): Promise<AuthCredential | null> {
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported on this platform`);
    }
    if (!CapacitorFirebaseAuth) {
      throw new Error(`CapacitorFirebaseAuth plugin not available`);
    }

    switch (provider) {

      case AuthProvider.Google: {
        const googleAuthProvider = new fireAuth.GoogleAuthProvider();
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const googleRes: GoogleSignInResult
          = await CapacitorFirebaseAuth.signIn({ providerId: googleAuthProvider.providerId }) as GoogleSignInResult;
        if (googleRes.idToken) {
          this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
          return fireAuth.GoogleAuthProvider.credential(googleRes.idToken);
        } else {
          return null;
        }
      }

      case AuthProvider.Facebook: {
        const facebookAuthProvider = new fireAuth.FacebookAuthProvider();
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const facebookRes: FacebookSignInResult
          = await CapacitorFirebaseAuth.signIn({ providerId: facebookAuthProvider.providerId }) as FacebookSignInResult;
        if (facebookRes.idToken) {
          this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
          return fireAuth.FacebookAuthProvider.credential(facebookRes.idToken);
        } else {
          return null;
        }
      }

      case AuthProvider.Apple: {
        if (await this.deviceSupportsNativeApple()) {
          const appleAuthProvider = new fireAuth.OAuthProvider('apple.com');
          this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
          const appleRes: AppleSignInResult
            = await CapacitorFirebaseAuth.signIn({ providerId: appleAuthProvider.providerId }) as AppleSignInResult;
          if (appleRes.idToken) {
            this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
            return appleAuthProvider.credential(appleRes);
          } else {
            return null;
          }
        } else if (this.capConfg.signInWithApple) {
          const signInConfig = this.capConfg.signInWithApple;
          return await new Promise<AuthCredential | null>(async (resolve, reject) => {
            const nonce = uuid();
            const deepLinkHandler: PluginListenerHandle = CapacitorFirebaseDynamicLinks.addListener('deepLinkOpen', async (data: { url: string }) => {
              if (data.url && data.url.startsWith(signInConfig.redirectDeekLink)) {
                const params = new URLSearchParams(new URL(data.url).search);
                const idToken = params.get('id_token');
                const error = params.get('error');
                deepLinkHandler.remove();
                browserCloseHandler.remove();
                await Browser.close();
                if (idToken && !error) {
                  const appleAuthProvider = new fireAuth.OAuthProvider('apple.com');
                  resolve(appleAuthProvider.credential({ idToken, rawNonce: nonce }));
                } else {
                  reject(error);
                }
              }
            });
            const browserCloseHandler: PluginListenerHandle = Browser.addListener('browserFinished', async (data: any) => {
              // handle user close of browser (i.e. cancel operation)
              deepLinkHandler.remove();
              browserCloseHandler.remove();
              resolve(null);
            });
            await Browser.open({
              url: `${signInConfig.authUrl || 'http://appleid.apple.com/auth/authorize'}`
                + `?nonce=${encodeURIComponent(sha256(nonce))}`
                + `&client_id=${encodeURIComponent(signInConfig.clientId)}`
                + `&redirect_uri=${encodeURIComponent(signInConfig.redirectUrl)}`
                + `&response_type=code%20id_token&response_mode=form_post`
            });
          });
        }
      }

      case AuthProvider.Twitter: {
        const twitterAuthProvider = new fireAuth.TwitterAuthProvider();
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const twitterRes: TwitterSignInResult
          = await CapacitorFirebaseAuth.signIn({ providerId: twitterAuthProvider.providerId }) as TwitterSignInResult;
        if (twitterRes.idToken && twitterRes.secret) {
          this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
          return fireAuth.TwitterAuthProvider.credential(twitterRes.idToken, twitterRes.secret);
        } else {
          return null;
        }
      }

      default:
        this.fire.addLogMessage(`Attempting unsupported native provider; provider=${provider}`);
        throw new Error(`${provider} is not available as a credential provider for this platform`);

    }
  }

  public async signOut() {
    if (CapacitorFirebaseAuth) {
      this.fire.addLogMessage('signOut using CapacitorFirebaseAuth');
      await CapacitorFirebaseAuth.signOut({});
    }
  }

}
