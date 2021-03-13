import { EnvConfig } from './EnvConfig';

export const environment: EnvConfig = {
  production: false,
  configDefaults: {},
  services: {
    firebaseRegion: '',
    inAppPurchase: false
  },
  firebase: {
    apiKey: process.env.FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_CONFIG_DATABASE_URL,
    projectId: process.env.FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CONFIG_WEB_APP_ID
  },
  uri: {
    web: '',
    tosUrl: '',
    privacyUrl: ''
  },
  iap: {
    validatorUrl: ''
  },
  dynamicLink: {
    domainUriPrefix: '',
    iosParameters: {
      bundleId: '',
      customScheme: ''
    }
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
