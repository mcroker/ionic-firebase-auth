import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import 'firebase/auth';
import { AuthCredential } from '@firebase/auth-types';
if (!firebase.auth) {
  throw new Error('firebase.auth is undefined');
}
import { GoogleSignInResult, FacebookSignInResult, TwitterSignInResult, CapacitorFirebaseAuthPlugin } from 'capacitor-firebase-auth';
import { Plugins, Capacitor, Device } from '@capacitor/core';
import { AuthProvider, ICredentialFactoryProvider, FirebaseService } from 'ngx-firebase';

const fbAuth = firebase.auth;

function firebaseAuthPlugin(): CapacitorFirebaseAuthPlugin {
  const pi = Plugins.CapacitorFirebaseAuth;
  if (!pi) {
    throw new Error('Capacitor Plugin CapacitorFirebaseAuth not available');
  }
  return pi as CapacitorFirebaseAuthPlugin;
}

@Injectable({
  providedIn: 'root'
})
export class AuthCredentialFactoryCapacitorService implements ICredentialFactoryProvider {

  constructor(
    private fire: FirebaseService
  ) {
  }

  private async deviceSupportsNativeApple(): Promise<boolean> {
    const osMajor = parseInt((await Device.getInfo()).osVersion.split('.')[0], 10);
    return osMajor >= 13 && Capacitor.platform === 'ios' && Capacitor.isPluginAvailable('SignInWithApple');
  }

  public async isProviderSupported(provider: AuthProvider): Promise<boolean> {
    switch (provider) {
      case AuthProvider.Apple:
        return await this.deviceSupportsNativeApple();

      case AuthProvider.Google:
      case AuthProvider.Facebook:
      case AuthProvider.Twitter:
        return Capacitor.isPluginAvailable('CapacitorFirebaseAuth');

      default:
        return false;
    }
  }

  public async getCredential(provider: AuthProvider): Promise<AuthCredential> {
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported on this platform`);
    }

    switch (provider) {

      case AuthProvider.Google: {
        const googleAuthProvider = new fbAuth.GoogleAuthProvider();
        const CapacitorFirebaseAuth = firebaseAuthPlugin();
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const googleRes: GoogleSignInResult
          = await CapacitorFirebaseAuth.signIn({ providerId: googleAuthProvider.providerId }) as GoogleSignInResult;
        this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
        return fbAuth.GoogleAuthProvider.credential(googleRes.idToken);
      }

      case AuthProvider.Apple: {
        const appleAuthProvider = new fbAuth.OAuthProvider('apple.com');
        const SignInWithApple = Plugins.SignInWithApple;
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const appleRes = await SignInWithApple.authorize();
        this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
        return appleAuthProvider.credential(appleRes.response.identityToken);
      }

      case AuthProvider.Facebook: {
        const facebookAuthProvider = new fbAuth.FacebookAuthProvider();
        const CapacitorFirebaseAuth = firebaseAuthPlugin();
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const facebookRes: FacebookSignInResult
          = await CapacitorFirebaseAuth.signIn({ providerId: facebookAuthProvider.providerId }) as FacebookSignInResult;
        this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
        return fbAuth.FacebookAuthProvider.credential(facebookRes.idToken);
      }

      case AuthProvider.Twitter: {
        const twitterAuthProvider = new fbAuth.TwitterAuthProvider();
        const CapacitorFirebaseAuth = firebaseAuthPlugin();
        this.fire.addLogMessage(`signIn using CapacitorFirebaseAuth; provider=${provider}`);
        const twitterRes: TwitterSignInResult
          = await CapacitorFirebaseAuth.signIn({ providerId: twitterAuthProvider.providerId }) as TwitterSignInResult;
        this.fire.addLogMessage(`Creating credential using firebase; provider=${provider}`);
        return fbAuth.TwitterAuthProvider.credential(twitterRes.idToken, twitterRes.secret);
      }

      default:
        this.fire.addLogMessage(`Attempting unsupported native provider; provider=${provider}`);
        throw new Error(`${provider} is not available as a credential provider for this platform`);

    }
  }

  public async signOut() {
    if (Capacitor.isPluginAvailable('CapacitorFirebaseAuth')) {
      this.fire.addLogMessage('signOut using CapacitorFirebaseAuth');
      const CapacitorFirebaseAuth = firebaseAuthPlugin();
      await CapacitorFirebaseAuth.signOut({});
    }
  }

}
