// @angular/*
import { NgModule, ModuleWithProviders, Optional, NgZone, PLATFORM_ID, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Ionic
import { IonicModule } from '@ionic/angular';

// Imported
import { TranslateModule } from '@ngx-translate/core';
import { TooltipsModule } from 'ionic4-tooltips';

// Configuration
import { malSharedConfigFactory, MalSharedConfig, MalUserProvidedConfig, UseEmulatorArguments } from './interfaces';
import { MalSharedConfigToken, MalUserProvidedConfigToken } from './interfaces/tokens';

// @angular/fire
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, FirebaseAppConfig, FirebaseApp, FirebaseOptions, AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule, USE_EMULATOR as AUTH_EMULATOR } from '@angular/fire/auth';
import { AngularFirestoreModule, USE_EMULATOR as FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { AngularFireRemoteConfig, ConfigTemplate, DEFAULTS as REMOTE_CONFIG_DEFAULTS, SETTINGS as REMOTE_CONFIG_SETTINGS } from '@angular/fire/remote-config';
import { DATA_COLLECTION_ENABLED, INSTRUMENTATION_ENABLED } from '@angular/fire/performance';
import { Settings as RemoteConfigSettings } from '@firebase/remote-config-types';
import { AngularFirePerformance } from '@angular/fire/performance';
import { USE_EMULATOR as FUNCTIONS_EMULATOR, AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

// Guards
import { LoggedInGuard, VerifyEmailGuard } from './guards';

// Components
import { ValueAccessorControlComponent } from './types/ValueAccessorControlComponent';
import { ValueAccessorValueComponent } from './types/ValueAccessorValueComponent';

// services
import { FirestoreSyncService } from './services/firestore-sync.service';
import { AuthProcessService } from './services/auth-process.service';
import { CrashlyticsService } from './services/crashlytics.service';
import { AnalyticsService } from './services/analytics.service';
import { RemoteConfigService } from './services/remoteconfig.service';
import { PerformanceService } from './services/performance.service';
import { MalService } from './services/mal.service';

const COMPONENTS = [
  ValueAccessorControlComponent,
  ValueAccessorValueComponent
];

const MODULES = [
  IonicModule,
  HttpClientModule,
  AngularFireAuthModule,
  AngularFirestoreModule,
  AngularFireFunctionsModule,
  TooltipsModule
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ...MODULES,
    TranslateModule.forChild(),
    AngularFireModule,
  ],
  exports: [
    ...COMPONENTS,
    ...MODULES,
    TranslateModule
  ],
  entryComponents: COMPONENTS
})
export class MalSharedModule {

  constructor(
    @Optional() performanceProvider: AngularFirePerformance
  ) {
  }

  static forRoot(
    config: MalUserProvidedConfig,
    appNameFactory: () => string | undefined = () => undefined,
  ): ModuleWithProviders<MalSharedModule> {
    return {
      ngModule: MalSharedModule,
      providers:
        [
          {
            provide: MalUserProvidedConfigToken,
            useValue: config
          },
          {
            provide: MalSharedConfigToken,
            useFactory: malSharedConfigFactory,
            deps: [MalUserProvidedConfigToken]
          },
          {
            provide: REMOTE_CONFIG_DEFAULTS,
            useValue: config.configDefaults
          },
          {
            provide: REMOTE_CONFIG_SETTINGS,
            useFactory: () => isDevMode() ? { minimumFetchIntervalMillis: 3600000 } : {} // 1 hour§
          },
          {
            provide: FIREBASE_OPTIONS,
            useValue: config.firebase
          },
          {
            provide: FIREBASE_APP_NAME,
            useFactory: appNameFactory
          },
          {
            provide: AUTH_EMULATOR,
            useFactory: authEmulatorFactory,
            deps: [MalSharedConfigToken]
          },
          {
            provide: FIRESTORE_EMULATOR,
            useFactory: firestoreEmulatorFactory,
            deps: [MalSharedConfigToken]
          },
          {
            provide: FUNCTIONS_EMULATOR,
            useFactory: functionsEmulatorFactory,
            deps: [MalSharedConfigToken]
          },
          {
            provide: REGION,
            useValue: config.services?.firebaseRegion || null
          },
          {
            provide: AngularFirePerformance,
            useFactory: performanceProviderFactory,
            deps: [
              MalSharedConfigToken,
              FirebaseApp,
              [new Optional(), DATA_COLLECTION_ENABLED],
              [new Optional(), INSTRUMENTATION_ENABLED],
              NgZone,
              PLATFORM_ID
            ]
          },
          {
            provide: AngularFireRemoteConfig,
            useFactory: remoteConfigFirebaseService,
            deps: [
              MalSharedConfigToken,
              FIREBASE_OPTIONS,
              FIREBASE_APP_NAME,
              REMOTE_CONFIG_SETTINGS,
              REMOTE_CONFIG_DEFAULTS,
              NgZone,
              PLATFORM_ID
            ]
          },
          AnalyticsService,
          CrashlyticsService,
          MalService,
          RemoteConfigService,
          AuthProcessService,
          FirestoreSyncService,
          PerformanceService,
          AngularFireAuth,
          LoggedInGuard,
          VerifyEmailGuard
        ],
    };
  }

}

function performanceProviderFactory(
  config: MalSharedConfig,
  app: FirebaseApp,
  dataCollectionEnabled: boolean,
  instrumentationEnabled: boolean,
  zone: NgZone,
  platformId: any
): AngularFirePerformance | null {
  if (config.services.firebasePerformance) {
    return new AngularFirePerformance(app, dataCollectionEnabled, instrumentationEnabled, zone, platformId);
  }
  return null;
}

function remoteConfigFirebaseService(
  config: MalSharedConfig,
  options: FirebaseOptions,
  nameOrConfig: string | FirebaseAppConfig,
  settings: RemoteConfigSettings,
  defaultConfig: ConfigTemplate,
  zone: NgZone,
  platformId: any
): AngularFireRemoteConfig | null {
  if (config.services.firebaseRemoteConfig) {
    return new AngularFireRemoteConfig(options, nameOrConfig, settings, defaultConfig, zone, platformId);
  }
  return null;
}

function authEmulatorFactory(config: MalSharedConfig): UseEmulatorArguments | undefined {
  if (true === config.services.firebaseAuth) {
    return undefined;
  } else {
    return config.services.firebaseAuth;
  }
}

function firestoreEmulatorFactory(config: MalSharedConfig): UseEmulatorArguments | undefined {
  if (true === config.services.firebaseFirestore) {
    return undefined;
  } else {
    return config.services.firebaseFirestore;
  }
}

function functionsEmulatorFactory(config: MalSharedConfig): UseEmulatorArguments | undefined {
  if (true === config.services.firebaseFunctions) {
    return undefined;
  } else {
    return config.services.firebaseFunctions;
  }
}
