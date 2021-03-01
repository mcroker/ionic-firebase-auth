// @angular/*
import { NgModule, ModuleWithProviders } from '@angular/core';

// Configuration
import {
  IAnalyticsProvider, ICrashlyticsProvider, ICredentialFactoryProvider,
  MalSharedConfig, MalUserProvidedConfig, FirebaseService,
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

@NgModule({
})
export class MalCapacitorModule {

  constructor(
  ) {
  }

  static forRoot(
    config: MalUserProvidedConfig,
    appNameFactory: () => string | undefined = () => undefined,
  ): ModuleWithProviders<MalCapacitorModule> {
    return {
      ngModule: MalCapacitorModule,
      providers:
        [
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
            deps: [FirebaseService]
          }
        ],
    };
  }

}

function analyticsProviderFactory(config: MalSharedConfig): IAnalyticsProvider | null {
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

function crashlyticsProviderFactory(config: MalSharedConfig): ICrashlyticsProvider | null {
  if (true === config.services.firebaseCrashlytics) {
    if (Capacitor.isPluginAvailable('FirebaseCrashlytics')) {
      return new CrashlyticsFirebaseCapacitorService();
    } else {
      console.info('Unable to instantiate FirebaseCrashlytics, Capacitor plugin is not available');
    }
  }
  return null;
}

function credFactoryProviderFactory(fire: FirebaseService): ICredentialFactoryProvider | null {
  if (Capacitor.isNative) {
    return new AuthCredentialFactoryCapacitorService(fire);
  } else {
    return null;
  }
}

