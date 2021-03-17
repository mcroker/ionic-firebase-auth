import { EnvConfig } from './EnvConfig';

export const environment: EnvConfig = {
  production: false,
  configDefaults: {},
  services: {
    firebaseRegion: '',
    inAppPurchase: false
  },
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  signInWithApple: {
    authUrl: 'http://appleid.apple.com/auth/authorize',
    redirectUrl: 'https://MYPROJECT.cloudfunctions.net/appleAuthHandler',
    redirectDeekLink: 'https://MYDEEPLINK/apple_response_url',
    scopes: "email name",
    clientId: "MYSERVICEID"
  },
  uri: {
    web: '',
    tosUrl: '',
    privacyUrl: ''
  },
  iap: {
    validatorUrl: ''
  },
  google: {
    apiKey: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
