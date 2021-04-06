import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { LoggedInGuard, VerifyEmailGuard } from 'ionic-firebase-auth';
import { GuardedPage } from './components/guarded/guarded.page';
import { HomePage } from './components/home-page/home.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'guarded',
    component: GuardedPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth-pages-routing.module').then(m => m.AuthUIPageModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

const extraOptions: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
  enableTracing: false,
  relativeLinkResolution: 'legacy'
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, extraOptions)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
  }
}
