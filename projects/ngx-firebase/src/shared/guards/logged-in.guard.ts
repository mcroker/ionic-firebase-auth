import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MalSharedConfig, MalSharedConfigToken } from '../interfaces';
import { AuthProcessService } from '../services/auth-process.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(
    @Inject(MalSharedConfigToken)
    private config: MalSharedConfig,
    private router: Router,
    private aps: AuthProcessService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.aps.user$.pipe(
      map(user => {
        if (user) {
          if (this.config.authUi.guardProtectedRoutesUntilEmailIsVerified && !user.emailVerified && !user.isAnonymous) {
            if (this.config.authUi.authGuardVerifyEmailURL) {
              return this.router.createUrlTree(
                [`${this.config.authUi.authGuardVerifyEmailURL}`], { queryParams: { redirectUrl: state.url } }
              );
            } else if (this.config.authUi.authGuardFallbackURL) {
              return this.router.createUrlTree(
                [`${this.config.authUi.authGuardFallbackURL}`], { queryParams: { redirectUrl: state.url } }
              );
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          if (this.config.authUi.authGuardFallbackURL) {
            return this.router.createUrlTree(
              [`${this.config.authUi.authGuardFallbackURL}`], { queryParams: { redirectUrl: state.url } }
            );
          }
          return false;
        }
      })
    );
  }

}
