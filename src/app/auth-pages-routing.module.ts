import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ROUTER_CONFIG, MalAuthUIPageModule } from 'ngx-firebase/auth-pages';

@NgModule({
  imports: [
    MalAuthUIPageModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ]
})
export class AuthUIPageModule { }
