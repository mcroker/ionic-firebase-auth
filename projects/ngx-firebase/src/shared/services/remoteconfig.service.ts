import { Injectable, Injector, Optional } from '@angular/core';
import { AngularFireRemoteConfig, mapToObject } from '@angular/fire/remote-config';
import { of } from 'rxjs';
import { Value, ValueSource } from '@firebase/remote-config-types';
import { DEFAULTS as REMOTE_CONFIG_DEFAULTS } from '@angular/fire/remote-config';

class StaticValue implements Value {
    constructor(private value: any) { }
    asBoolean() { return this.value as boolean; }
    asString() { return this.value as string; }
    asNumber() { return this.value as number; }
    getSource() { return 'static' as ValueSource; }
}

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {

    defaults: { [key: string]: any } = this.injector.get(REMOTE_CONFIG_DEFAULTS) || {};

    remoteConfig$ = of(this.defaults);
    parameters = of([]);
    async getBoolean(key: string): Promise<boolean> { return (await this.getValue(key)).asBoolean(); }
    async getNumber(key: string): Promise<number> { return (await this.getValue(key)).asNumber(); }
    async getString(key: string): Promise<string> { return (await this.getValue(key)).asString(); }
    getValue(key: string): Promise<Value> { return Promise.resolve(new StaticValue(this.defaults[key])); }

    constructor(
        @Optional() remoteConfigProvider: AngularFireRemoteConfig,
        private injector: Injector
    ) {
        if (remoteConfigProvider) {
            this.getBoolean = remoteConfigProvider.getBoolean;
            this.getNumber = remoteConfigProvider.getNumber;
            this.getString = remoteConfigProvider.getString;
            this.getValue = remoteConfigProvider.getValue;
            this.remoteConfig$ = remoteConfigProvider.parameters.pipe(
                mapToObject(this.defaults)
            );
        }
    }

}
