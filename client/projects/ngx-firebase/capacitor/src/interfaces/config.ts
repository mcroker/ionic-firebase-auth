import { InjectionToken } from "@angular/core";

export interface MalSignInWithAppleConfig {
    authUrl: string;
    redirectUrl: string;
    redirectDeekLink: string;
    scopes?: string;
    clientId: string;
}

export interface MalCapacitorConfig {
    signInWithApple?: MalSignInWithAppleConfig;
}

export const MalCapacitorConfigToken = new InjectionToken<MalCapacitorConfig>('MalCapacitorConfigToken');