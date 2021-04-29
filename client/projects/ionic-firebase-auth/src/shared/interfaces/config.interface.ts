// import * as firebase from 'firebase';

import { FirebaseAppConfig } from '@angular/fire';
import { ConfigTemplate } from '@angular/fire/remote-config';
import { AuthProvider } from './authprovider.enum';

export interface AuthUIConfig {
  authGuardFallbackURL: string;
  authGuardLoggedInURL: string;
  authGuardVerifyEmailURL?: string;
  enableFirestoreSync: boolean;
  reSignInUrl: string;

  // Toasts
  toastMessageOnAuthSuccess: boolean | string;
  toastMessageOnAuthError: boolean | string;
  toastDefaultDurationMil: number;

  logoUrl?: string;

  // Terms and Conditions
  tosUrl?: string;
  privacyPolicyUrl?: string;

  // Password length min/max in forms independently of each componenet min/max.
  // `min/max` input parameters in components should be within this range.
  passwordMaxLength: number;
  passwordMinLength: number;
  passwordRequireLowercase: boolean;
  passwordRequireUppercase: boolean;
  passwordRequireSpecial: boolean;
  passwordRequireNumbers: boolean;

  // Same as password but for the name
  nameMaxLength: number;
  nameMinLength: number;

  // Custom Backgrounds
  verifyEmailBackground?: string;

  supportedProviders: AuthProvider.ALL | AuthProvider[];

  guestEnabled: boolean;

  allowAccountEdit: boolean;
  allowAccountDelete: boolean;
  allowAccountLogout: boolean;

  // If set, sign-in/up form is not available until email has been verified.
  // Plus protected routes are still protected even though user is connected.
  guardProtectedRoutesUntilEmailIsVerified: boolean;

  // Control whether or not email verification is used
  enableEmailVerification: boolean;

  // Avatar
  avatarShowIfAnon: boolean;
}

export enum MalServiceEnabled {
  emulate = 2,
  enabled = 1,
  disabled = 0
}

export type UseEmulatorArguments = [string, number];

export interface AuthServicesConfig {
  firebaseAnalytics: boolean;
  firebaseCrashlytics: boolean;
  firebasePerformance: boolean;
  firebaseRemoteConfig: boolean;
  inAppPurchase: boolean;
  firebaseAuth: true | UseEmulatorArguments;
  firebaseFirestore: true | UseEmulatorArguments;
  firebaseFunctions: true | UseEmulatorArguments;
  firebaseRegion?: string;
}


export interface AuthUserProvidedConfig<T extends ConfigTemplate = ConfigTemplate> {
  firebase: FirebaseAppConfig;
  services?: Partial<AuthServicesConfig>;
  authUi?: Partial<AuthUIConfig>;
  configDefaults?: T;
}

export interface AuthSharedConfig<T extends ConfigTemplate = ConfigTemplate> {
  firebase: FirebaseAppConfig;
  services: AuthServicesConfig;
  authUi: AuthUIConfig;
  configDefaults: T;
}

export const defaultAuthFirebaseUIConfig: Omit<AuthSharedConfig, 'firebase' | 'configDefaults'> = {
  services: {
    firebaseAnalytics: true,
    firebaseCrashlytics: true,
    firebasePerformance: true,
    firebaseRemoteConfig: true,
    inAppPurchase: true,
    firebaseAuth: true,
    firebaseFirestore: true,
    firebaseFunctions: true
  },
  authUi: {
    enableFirestoreSync: true,
    toastMessageOnAuthSuccess: true,
    toastMessageOnAuthError: true,
    toastDefaultDurationMil: 3000,
    authGuardFallbackURL: '/',
    authGuardLoggedInURL: '/',
    authGuardVerifyEmailURL: undefined,
    reSignInUrl: '/auth/signin',

    // Password length min/max in forms independently of each componenet min/max.
    // `min/max` input parameters in components should be within this range.
    passwordMaxLength: 60,
    passwordMinLength: 8,
    passwordRequireLowercase: true,
    passwordRequireUppercase: true,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,

    // Same as password but for the name
    nameMaxLength: 50,
    nameMinLength: 2,

    supportedProviders: AuthProvider.ALL,

    guestEnabled: false,

    allowAccountEdit: true,
    allowAccountDelete: true,
    allowAccountLogout: true,

    // If set, sign-in/up form is not available until email has been verified.
    // Plus protected routes are still protected even though user is connected.
    guardProtectedRoutesUntilEmailIsVerified: true,

    // Default to email verification on
    enableEmailVerification: true,

    avatarShowIfAnon: true
  }
};

// Merge default config with user provided config.
export function authSharedConfigFactory<T extends ConfigTemplate>(userProvidedConfig: AuthUserProvidedConfig<T>): AuthSharedConfig<T> {
  return {
    firebase: userProvidedConfig.firebase,
    services: Object.assign({}, defaultAuthFirebaseUIConfig.services, userProvidedConfig.services || {}),
    authUi: Object.assign({}, defaultAuthFirebaseUIConfig.authUi, userProvidedConfig.authUi || {}),
    configDefaults: userProvidedConfig.configDefaults || {} as T
  };
}
