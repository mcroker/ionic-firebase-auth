// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Mal
import { MalSharedModule } from 'ngx-firebase';

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
  MalSharedModule,
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

