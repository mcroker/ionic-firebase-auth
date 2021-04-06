// @angular/*
import { ModuleWithProviders, NgModule } from '@angular/core';

// Configuration
import {
  IAnalyticsProvider, ICrashlyticsProvider, ICredentialFactoryProvider,
  AuthSharedConfig, FirebaseService,
  AuthCredentialFactoryProviderToken, AuthSharedConfigToken, AuthAnalyticsProviderToken, AuthCrashlyticsProviderToken
} from 'ionic-firebase-auth';

// Capacitor
import { Capacitor } from '@capacitor/core';

// Guards

// Components

// services
import { AnalyticsFirebaseCapacitorService } from './services/analytics-firebase-capacitor.service';
import { CrashlyticsFirebaseCapacitorService } from './services/crashlytics-firebase-capacitor.service';
import { AuthCredentialFactoryCapacitorService } from './services/credential-factory-capacitor.service';
import { AuthCapacitorConfig, AuthCapacitorConfigToken } from './interfaces';

@NgModule()
export class AuthCapacitorModule {

  static forRoot(config: AuthCapacitorConfig): ModuleWithProviders<AuthCapacitorModule> {
    return {
      ngModule: AuthCapacitorModule,
      providers:
        [
          {
            provide: AuthCapacitorConfigToken,
            useValue: config
          },
          {
            provide: AuthAnalyticsProviderToken,
            useFactory: analyticsProviderFactory,
            deps: [AuthSharedConfigToken]
          },
          {
            provide: AuthCrashlyticsProviderToken,
            useFactory: crashlyticsProviderFactory,
            deps: [AuthSharedConfigToken]
          },
          {
            provide: AuthCredentialFactoryProviderToken,
            useFactory: credFactoryProviderFactory,
            deps: [FirebaseService, AuthSharedConfigToken, AuthCapacitorConfigToken]
          }
        ]
    }
  }
}

export function analyticsProviderFactory(config: AuthSharedConfig): IAnalyticsProvider | null {
  if (config.services.firebaseAnalytics) {
    if (Capacitor.platform === 'web') {
      console.info('Unable to instantiate firebaseeAnalytics, Capacitor plugin not supported on web platforn.');
    } else if (Capacitor.isPluginAvailable('FirebaseAnalytics')) {
      return new AnalyticsFirebaseCapacitorService();
    } else {
      console.info('Unable to instantiate firebaseeAnalytics, Capacitor plugin is not available');
    }
  }
  return null;
}

export function crashlyticsProviderFactory(config: AuthSharedConfig): ICrashlyticsProvider | null {
  if (true === config.services.firebaseCrashlytics) {
    if (Capacitor.isPluginAvailable('FirebaseCrashlytics')) {
      return new CrashlyticsFirebaseCapacitorService();
    } else {
      console.info('Unable to instantiate FirebaseCrashlytics, Capacitor plugin is not available');
    }
  }
  return null;
}

export function credFactoryProviderFactory(fire: FirebaseService, sharedConfig: AuthSharedConfig, capConfig: AuthCapacitorConfig): ICredentialFactoryProvider | null {
  if (Capacitor.isNative) {
    return new AuthCredentialFactoryCapacitorService(fire, sharedConfig, capConfig);
  } else {
    return null;
  }
}

