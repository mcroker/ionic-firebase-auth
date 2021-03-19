import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthProcessService, AuthProvider, FirebaseService, UiService } from 'ngx-firebase';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@firebase/auth-types';

@Component({
    templateUrl: 'home.page.html'
})
export class HomePage {

    private readonly destroy$: ReplaySubject<void> = new ReplaySubject<void>();
    private redirectUrl: string | null = null;

    public readonly user$: Observable<User | null> = this.aps.user$;
    public readonly canRegister$: Observable<boolean> = this.aps.canRegister$;
    public readonly canSignIn$: Observable<boolean> = this.aps.canSignIn$;
    public readonly canSignInAsGuest$: Observable<boolean> = this.aps.canSignInAsGuest$;
    public readonly canSignOut$: Observable<boolean> = this.aps.canSignOut$;
    public readonly canEdit$: Observable<boolean> = this.aps.canEdit$;

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

    async doSignOut() {
        try {
            await this.aps.signOut();
        } catch (error) {
            this.ui.logError(error, 'shared.genericError');
        }
    }

    async doSignIn() {
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