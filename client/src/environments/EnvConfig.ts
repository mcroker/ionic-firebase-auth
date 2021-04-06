import { AuthUserProvidedConfig } from 'projects/ionic-firebase-auth';
import { AuthCapacitorConfig } from 'projects/ionic-firebase-auth/capacitor/src/interfaces';

export interface EnvConfig extends AuthUserProvidedConfig, AuthCapacitorConfig {
    production: boolean;
    e2eAutomation?: boolean;
    uri: {
        web: string,
        tosUrl?: string,
        privacyUrl?: string
    };
    iap: {
        validatorUrl: string;
    };
    google: {
        apiKey: string;
    };
}
