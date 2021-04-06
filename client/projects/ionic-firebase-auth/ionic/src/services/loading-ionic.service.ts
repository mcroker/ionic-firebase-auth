import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ILoadingUIProvider, RemoteConfigService } from 'ionic-firebase-auth';

@Injectable()
export class AuthIonicLoadingService implements ILoadingUIProvider {

    constructor(
        private loadingController: LoadingController,
        private translateService: TranslateService,
        private remoteConfig: RemoteConfigService
    ) {
        this.watchLoading = this.watchLoading.bind(this);
    }

    async createLoading(message?: string) {
        if (message) {
            message = await this.translateService.get(message).toPromise();
            return await this.loadingController.create({ message });
        } else {
            return await this.loadingController.create();
        }
    }

    async watchLoading(
        source: Observable<boolean>,
        options?: { debounce?: number, message?: string, timeoutMs?: number | null, debug?: string }
    ): Promise<Subscription> {

        const timeoutInterval = (undefined !== options?.timeoutMs)
            ? options.timeoutMs
            : await this.remoteConfig.getNumber('timeoutLoading');

        const loading = await this.createLoading(options?.message);

        source = !timeoutInterval ? source : source.pipe(timeout(timeoutInterval));

        return source.pipe(
            debounceTime(options?.debounce || 100)
        ).subscribe(
            isLoading => isLoading ? loading.present() : loading.dismiss(),
            () => { loading.dismiss(); },  // Dismiss on error including timeout,
            () => { loading.dismiss(); }   // Dismiss on completion
        );

    }

}
