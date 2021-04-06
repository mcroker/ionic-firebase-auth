// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Mal
import { AuthSharedModule } from 'ionic-firebase-auth';
import { AuthIonicModule } from 'ionic-firebase-auth/ionic';

// Ionic
import { IonicModule } from '@ionic/angular';

// Translate
import { TranslateModule } from '@ngx-translate/core';

// Components

// Directives

export const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  AuthSharedModule,
  AuthIonicModule,
  IonicModule
];

export const COMPONENTS = [
];

@NgModule({
  imports: [
    ...MODULES,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: COMPONENTS,
  exports: [
    ...MODULES,
    ...COMPONENTS,
    TranslateModule
  ]
})
export class SharedModule { }

