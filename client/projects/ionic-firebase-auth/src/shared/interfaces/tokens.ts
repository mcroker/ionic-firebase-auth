// This token is the official token containing the final configuration; ie. the merge between default and user provided configurations
import { InjectionToken } from '@angular/core';

import { AuthSharedConfig, AuthUserProvidedConfig } from './config.interface';
import { IAnalyticsProvider, IAuthHooksService, IAuthProcessService, ICrashlyticsProvider, ICredentialFactoryProvider } from './providers.interface';
import { ILoadingUIProvider, IAlertsUIProvider, IPickerUIProvider, IToastUIProvider, ILegalityDialogUIProvider} from './ui-providers.interface'

// Firebase Functional Areas
export const AuthAnalyticsProviderToken = new InjectionToken<IAnalyticsProvider>('AuthAnalyticsProviderToken');
export const AuthCrashlyticsProviderToken = new InjectionToken<ICrashlyticsProvider>('AuthCrashlyticsProviderToken');
export const AuthhServiceProviderToken = new InjectionToken<IAuthProcessService>('AuthhServiceProviderToken');

// Auth Process Service
export const AuthHooksProviderToken = new InjectionToken<IAuthHooksService>('AuthHooksProviderToken');
export const AuthCredentialFactoryProviderToken = new InjectionToken<ICredentialFactoryProvider>('AuthCredentialFactoryProviderToken');

// Configuration
export const AuthUserProvidedConfigToken = new InjectionToken<AuthUserProvidedConfig>('AuthUserProvidedConfigToken');
export const AuthSharedConfigToken = new InjectionToken<AuthSharedConfig>('AuthSharedConfigToken');

// UI Providers
export const AuthLoadingUIProviderToken = new InjectionToken<ILoadingUIProvider>('AuthLoadingUIProviderToken');
export const AuthAlertsUIProviderToken = new InjectionToken<IAlertsUIProvider>('AuthAlertsUIProviderToken');
export const AuthPickerUIProviderToken = new InjectionToken<IPickerUIProvider>('AuthPickerUIProviderToken');
export const AuthToastUIProviderToken = new InjectionToken<IToastUIProvider>('AuthToastUIProviderToken');
export const AuthLegaliyDialogUIProiderToken = new InjectionToken<ILegalityDialogUIProvider>("AuthLegaliyDialogUIProiderToken");