// @angular/*
import { ModuleWithProviders, NgModule } from '@angular/core';

// Configuration
import {
  IAnalyticsProvider, ICrashlyticsProvider, ICredentialFactoryProvider,
  MalSharedConfig, FirebaseService,
  MalCredentialFactoryProviderToken, MalSharedConfigToken, MalAnalyticsProviderToken, MalCrashlyticsProviderToken
} from 'ngx-firebase';

// Capacitor
import { Capacitor } from '@capacitor/core';

// Guards

// Components

// services
import { AnalyticsFirebaseCapacitorService } from './services/analytics-firebase-capacitor.service';
import { CrashlyticsFirebaseCapacitorService } from './services/crashlytics-firebase-capacitor.service';
import { AuthCredentialFactoryCapacitorService } from './services/credential-factory-capacitor.service';
import { MalCapacitorConfig, MalCapacitorConfigToken } from './interfaces';

@NgModule()
export class MalCapacitorModule {

  static forRoot(config: MalCapacitorConfig): ModuleWithProviders<MalCapacitorModule> {
    return {
      ngModule: MalCapacitorModule,
      providers:
        [
          {
            provide: MalCapacitorConfigToken,
            useValue: config
          },
          {
            provide: MalAnalyticsProviderToken,
            useFactory: analyticsProviderFactory,
            deps: [MalSharedConfigToken]
          },
          {
            provide: MalCrashlyticsProviderToken,
            useFactory: crashlyticsProviderFactory,
            deps: [MalSharedConfigToken]
          },
          {
            provide: MalCredentialFactoryProviderToken,
            useFactory: credFactoryProviderFactory,
            deps: [FirebaseService, MalSharedConfigToken, MalCapacitorConfigToken]
          }
        ]
    }
  }
}

export function analyticsProviderFactory(config: MalSharedConfig): IAnalyticsProvider | null {
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

export function crashlyticsProviderFactory(config: MalSharedConfig): ICrashlyticsProvider | null {
  if (true === config.services.firebaseCrashlytics) {
    if (Capacitor.isPluginAvailable('FirebaseCrashlytics')) {
      return new CrashlyticsFirebaseCapacitorService();
    } else {
      console.info('Unable to instantiate FirebaseCrashlytics, Capacitor plugin is not available');
    }
  }
  return null;
}

export function credFactoryProviderFactory(fire: FirebaseService, sharedConfig: MalSharedConfig, capConfig: MalCapacitorConfig): ICredentialFactoryProvider | null {
  if (Capacitor.isNative) {
    return new AuthCredentialFactoryCapacitorService(fire, sharedConfig, capConfig);
  } else {
    return null;
  }
}

