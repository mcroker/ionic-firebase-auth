// @angular/*
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ionic
import { IonicModule } from '@ionic/angular';

// Mal
import { MalSharedModule } from 'ngx-firebase';

// components
import { AuthUINameFieldComponent } from './components/name-field/name-field.component';
import { AuthUIPasswordFieldComponent } from './components/password-field/password-field.component';
import { AuthUIEmailFieldComponent } from './components/email-field/email-field.component';
import { AuthUIOrDividerComponent } from './components/or-divider/or-divider.component';
import { AuthUIFormFieldComponent } from './components/form-field/form-field.component';
import { AuthProvidersComponent } from './components/providers/providers.component';

const COMPONENTS = [
  AuthUIPasswordFieldComponent,
  AuthUIEmailFieldComponent,
  AuthUINameFieldComponent,
  AuthUIFormFieldComponent,
  AuthUIOrDividerComponent,
  AuthProvidersComponent
];

@NgModule({
  imports: [
    MalSharedModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    IonicModule
  ],
  exports: [
    ...COMPONENTS,
    // Angular & Ionic
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    IonicModule
  ],
  declarations: COMPONENTS
})
export class MalIonicUISharedModule { }
