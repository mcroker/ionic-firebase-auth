import { EnvConfig } from './EnvConfig';

export const environment: EnvConfig = {
  production: true,
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
    appId: '',
    measurementId: ''
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
