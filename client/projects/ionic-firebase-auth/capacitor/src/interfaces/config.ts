import { InjectionToken } from "@angular/core";

export interface AuthSignInWithAppleConfig {
    authUrl?: string;
    redirectUrl: string;
    redirectDeekLink: string;
    scopes?: string;
    clientId: string;
}

export interface AuthCapacitorConfig {
    signInWithApple?: AuthSignInWithAppleConfig;
}

export const AuthCapacitorConfigToken = new InjectionToken<AuthCapacitorConfig>('AuthCapacitorConfigToken');