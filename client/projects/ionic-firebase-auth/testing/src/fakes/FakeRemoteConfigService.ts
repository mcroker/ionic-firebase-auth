import { RemoteConfigService } from 'ionic-firebase-auth';
import { forwardRef, Inject, Injectable, Optional } from '@angular/core';
import { ConfigTemplate } from '@angular/fire/remote-config';
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
export class FakeRemoteConfigService {

    defaults: { [key: string]: any } = this.configDefaults || {};

    remoteConfig$ = of(this.defaults);
    parameters = of([]);

    static create(): FakeRemoteConfigService & RemoteConfigService {
        return new FakeRemoteConfigService() as any as FakeRemoteConfigService & RemoteConfigService;
    }

    async getBoolean(key: string): Promise<boolean> { return (await this.getValue(key)).asBoolean(); }
    async getNumber(key: string): Promise<number> { return (await this.getValue(key)).asNumber(); }
    async getString(key: string): Promise<string> { return (await this.getValue(key)).asString(); }
    getValue(key: string): Promise<Value> { return Promise.resolve(new StaticValue(this.defaults[key])); }

    constructor(
        @Optional() @Inject(forwardRef(() => REMOTE_CONFIG_DEFAULTS)) public configDefaults?: ConfigTemplate,
    ) {
    }

}
