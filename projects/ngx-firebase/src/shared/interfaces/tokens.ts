// This token is the official token containing the final configuration; ie. the merge between default and user provided configurations
import { InjectionToken } from '@angular/core';

import { MalSharedConfig, MalUserProvidedConfig } from './config.interface';
import { IAnalyticsProvider, IAuthMergeUserService, IAuthProcessService, ICrashlyticsProvider, ICredentialFactoryProvider } from './providers.interface';
import { ILoadingUIProvider, IAlertsUIProvider, IPickerUIProvider, IToastUIProvider, ILegalityDialogUIProvider} from './ui-providers.interface'

// Firebase Functional Areas
export const MalAnalyticsProviderToken = new InjectionToken<IAnalyticsProvider>('MalAnalyticsProviderToken');
export const MalCrashlyticsProviderToken = new InjectionToken<ICrashlyticsProvider>('MalCrashlyticsProviderToken');
export const MalAuthServiceProviderToken = new InjectionToken<IAuthProcessService>('MalAuthServiceProviderToken');

// Auth Process Service
export const MalMergeUserServiceToken = new InjectionToken<IAuthMergeUserService>('MalMergeUserServiceToken');
export const MalCredentialFactoryProviderToken = new InjectionToken<ICredentialFactoryProvider>('MalCredentialFactoryProviderToken');

// Configuration
export const MalUserProvidedConfigToken = new InjectionToken<MalUserProvidedConfig>('MalUserProvidedConfigToken');
export const MalSharedConfigToken = new InjectionToken<MalSharedConfig>('MalSharedConfigToken');

// UI Providers
export const MalLoadingUIProviderToken = new InjectionToken<ILoadingUIProvider>('MalLoadingUIProviderToken');
export const MalAlertsUIProviderToken = new InjectionToken<IAlertsUIProvider>('MalAlertsUIProviderToken');
export const MalPickerUIProviderToken = new InjectionToken<IPickerUIProvider>('MalPickerMalPickerUIProviderTokenUIProvider');
export const MalToastUIProviderToken = new InjectionToken<IToastUIProvider>('MalToastUIProviderToken');
export const MalLegaliyDialogUIProiderToken = new InjectionToken<ILegalityDialogUIProvider>("MalLegaliyDialogUIProiderToken");