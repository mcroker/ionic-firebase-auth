import { Plugins, Capacitor } from '@capacitor/core';
import { RecordExceptionOptions } from '@capacitor-community/firebase-crashlytics';
import { Injectable } from '@angular/core';
import { ICrashlyticsProvider } from 'ionic-firebase-auth';
const { FirebaseCrashlytics } = Plugins;

@Injectable({ providedIn: 'root' })
export class CrashlyticsFirebaseCapacitorService implements ICrashlyticsProvider {

    constructor(
    ) {
    }

    setUserId(uid: string | null) {
        if (Capacitor.isPluginAvailable('FirebaseCrashlytics')) {
            FirebaseCrashlytics.setUserId({ userId: uid });
        }
    }

    async recordException(options: RecordExceptionOptions) {
        if (Capacitor.isPluginAvailable('FirebaseCrashlytics')) {
            await FirebaseCrashlytics.recordException(options);
        } else {
            console.log('Crashlytics Exception (not sent)>', options.message, options);
        }
    }

    async addLogMessage(message: string) {
        if (Capacitor.isPluginAvailable('FirebaseCrashlytics')) {
            await FirebaseCrashlytics.addLogMessage({ message });
        } else {
            console.log('Crashlytics Log (not sent)>', message);
        }
    }

}
