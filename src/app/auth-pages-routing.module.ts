import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ROUTER_CONFIG, MalIonicAuthUiModule } from 'ngx-firebase/ionic-auth-ui';

@NgModule({
  imports: [
    MalIonicAuthUiModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ]
})
export class AuthUIPageModule { }
