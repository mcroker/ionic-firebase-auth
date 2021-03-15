import { FirebaseOptions } from '@angular/fire';
import { UiService, MalServicesConifg } from 'ngx-firebase';
import { LinkConfig } from '@turnoutt/capacitor-firebase-dynamic-links';

export interface EnvConfig {
    production: boolean;
    e2eAutomation?: boolean;
    configDefaults: { [key: string]: any };
    services?: Partial<UiService & MalServicesConifg>;
    firebase: FirebaseOptions;
    uri: {
        web: string,
        tosUrl?: string,
        privacyUrl?: string
    };
    dynamicLink: Partial<LinkConfig> & {
        domainUriPrefix: string
    };
    iap: {
        validatorUrl: string;
    };
    google: {
        apiKey: string;
    };
}
