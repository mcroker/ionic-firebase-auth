import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthSharedConfig, AuthSharedConfigToken } from '../interfaces';
import { AuthProcessService } from '../services/auth-process.service';
import { User } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate, CanLoad {
  constructor(
    @Inject(AuthSharedConfigToken)
    private config: AuthSharedConfig,
    private router: Router,
    private aps: AuthProcessService
  ) {
  }

  private guardOutcome(redirectUrl?: string): Observable<boolean | UrlTree> {
    return this.aps.user$.pipe(
      take(1),
      map((user: User | null) => {
        if (user) {
          if (this.config.authUi.guardProtectedRoutesUntilEmailIsVerified && !user.emailVerified && !user.isAnonymous) {
            if (this.config.authUi.authGuardVerifyEmailURL) {
              return this.router.createUrlTree(
                [`${this.config.authUi.authGuardVerifyEmailURL}`], { queryParams: { redirectUrl } }
              );
            } else if (this.config.authUi.authGuardFallbackURL) {
              return this.router.createUrlTree(
                [`${this.config.authUi.authGuardFallbackURL}`], { queryParams: { redirectUrl } }
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
              [`${this.config.authUi.authGuardFallbackURL}`], { queryParams: { redirectUrl } }
            );
          }
          return false;
        }
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return this.guardOutcome(segments[0].parameters.url);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.guardOutcome(state.url);
  }

}
