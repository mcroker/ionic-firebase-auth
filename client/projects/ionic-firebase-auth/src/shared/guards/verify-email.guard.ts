import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthSharedConfig, AuthSharedConfigToken } from '../interfaces';
import { AuthProcessService } from '../services/auth-process.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailGuard implements CanActivate {
  constructor(
    @Inject(AuthSharedConfigToken)
    private config: AuthSharedConfig,
    private router: Router,
    private aps: AuthProcessService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.aps.user$.pipe(
      map(user => {
        if (user
          && !user.emailVerified
          && !user.isAnonymous
          && this.config.authUi.authGuardVerifyEmailURL
        ) {
          return this.router.createUrlTree([`${this.config.authUi.authGuardVerifyEmailURL}`], { queryParams: { redirectUrl: state.url } });
        } else {
          return true;
        }
      })
    );
  }

}
