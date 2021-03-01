import { Plugins, Capacitor } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { IAnalyticsProvider } from 'ngx-firebase';
const { FirebaseAnalytics } = Plugins;

@Injectable({ providedIn: 'root' })
export class AnalyticsFirebaseCapacitorService implements IAnalyticsProvider {

    get isWeb(): boolean {
        return Capacitor.platform === 'web';
    }

    setUserId(userId: string | null) {
        if (!this.isWeb) {
            FirebaseAnalytics.setUserId({ userId });
        }
    }

    async logEvent(name: string, params: { [key: string]: any } = {}) {
        if (!this.isWeb) {
            FirebaseAnalytics.logEvent({ name, params });
        } else {
            console.log('Firebase Analytics Event (not sent)>', name);
        }
    }

    async setScreenName(screenName: string, screenClass?: string) {
        if (!this.isWeb) {
            await this.logEvent('screen_view', {
                screen_name: screenName,
                screen_class: screenClass
            });
        } else {
            console.log('Firebase Analytics ScreenName (not sent)>', screenName, screenClass);
        }
    }

}
