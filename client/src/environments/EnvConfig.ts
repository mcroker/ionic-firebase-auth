import { MalUserProvidedConfig } from 'projects/ngx-firebase';
import { MalCapacitorConfig } from 'projects/ngx-firebase/capacitor/src/interfaces';

export interface EnvConfig extends MalUserProvidedConfig, MalCapacitorConfig {
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
