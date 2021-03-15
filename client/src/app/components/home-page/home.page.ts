import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthProcessService, AuthProvider, FirebaseService, UiService } from 'ngx-firebase';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: 'home.page.html'
})
export class HomePage {

    private readonly destroy$: ReplaySubject<void> = new ReplaySubject<void>();
    private redirectUrl: string | null = null;

    constructor(
        private aps: AuthProcessService,
        private navController: NavController,
        private ui: UiService,
        private fire: FirebaseService,
        private activatedRoute: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.fire.setScreenName('home', 'HomePage');

        this.activatedRoute.queryParamMap
            .pipe(takeUntil(this.destroy$))
            .subscribe(paramMap => {
                this.redirectUrl = paramMap.get('redirectUrl');
            });
    }

    async doLogin() {
        try {
            this.navController.navigateForward(['/auth/signin'], { queryParams: { redirectUrl: this.redirectUrl } });
        } catch (error) {
            this.ui.logError(error, 'shared.genericError');
        }
    }

    async doRegister() {
        try {
            this.navController.navigateForward(['/auth/register'], { queryParams: { redirectUrl: this.redirectUrl } });
        } catch (error) {
            this.ui.logError(error, 'shared.genericError');
        }
    }

    async doContinueAnonymously() {
        try {
            await this.aps.signInWith(AuthProvider.ANONYMOUS);
            if (this.redirectUrl) {
                await this.navController.navigateRoot(this.redirectUrl);
            }
        } catch (error) {
            this.ui.logError(error, 'auth.common.pleaseRetry');
        }
    }

}