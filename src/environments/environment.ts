import { EnvConfig } from './EnvConfig';

export const environment: EnvConfig = {
  production: false,
  configDefaults: {},
  services: {
    firebaseRegion: '',
    inAppPurchase: false
  },
  firebase: {
    apiKey: 'AIzaSyA3li57QdPrUfHRfLs28s691xljlVq3kxU',
    authDomain: 'readtrack-dev-64a12.firebaseapp.com',
    databaseURL: 'https://readtrack-dev-64a12.firebaseio.com',
    projectId: 'readtrack-dev-64a12',
    storageBucket: 'readtrack-dev-64a12.appspot.com',
    messagingSenderId: '742690746406',
    appId: '1:742690746406:web:1e8baeffe18294350af6e7',
    measurementId: 'G-87ZR2Y0VY0'
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
