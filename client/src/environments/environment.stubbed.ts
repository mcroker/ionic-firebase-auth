import { EnvConfig } from './EnvConfig';

export const environment: EnvConfig = {
  production: false,
  configDefaults: {},
  services: {
    firebaseAuth: ['localhost', 9099],
    firebaseFirestore: ['localhost', 8080],
    firebaseFunctions: ['localhost', 5001],
    firebasePerformance: false,
    firebaseCrashlytics: false,
    firebaseRemoteConfig: false,
    inAppPurchase: false
  },
  firebase: {
    apiKey: 'fake',
    measurementId: '',
    authDomain: 'ionic-firebase-auth-app.firebaseapp.com',
    projectId: 'ionic-firebase-auth-app',
    storageBucket: 'ionic-firebase-auth-app.appspot.com',
    messagingSenderId: '',
    appId: ''
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
