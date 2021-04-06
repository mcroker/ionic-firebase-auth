// @angular/*
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'

// Ionic
import { IonicModule } from '@ionic/angular';


// components
import { AuthAvatarComponent } from './components/avatar/avatar.component';
import { AuthPopoverMenuComponent } from './components/popover-menu/popover-menu.component';

// services
import { AuthIonicAlertsService } from './services/alerts-ionic.service';
import { AuthIonicLoadingService } from './services/loading-ionic.service';
import { AuthIonicPickerService } from './services/picker-ionic.service';
import { AuthIonicToastService } from './services/toast-ionic.service';
import { AuthIonicLegalityDialogService } from './services/legality-dialog-ionic.service';

// Mal
import {
  AuthToastUIProviderToken, AuthAlertsUIProviderToken, AuthLoadingUIProviderToken,
  AuthPickerUIProviderToken, AuthLegaliyDialogUIProiderToken, AuthSharedModule
} from 'ionic-firebase-auth';

// pages

const COMPONENTS = [
  AuthAvatarComponent,
  AuthPopoverMenuComponent
];

@NgModule({
  imports: [
    AuthSharedModule,
    CommonModule,
    HttpClientModule,
    IonicModule
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
  providers:
    [
      { provide: AuthAlertsUIProviderToken, useClass: AuthIonicAlertsService },
      { provide: AuthLoadingUIProviderToken, useClass: AuthIonicLoadingService },
      { provide: AuthPickerUIProviderToken, useClass: AuthIonicPickerService },
      { provide: AuthToastUIProviderToken, useClass: AuthIonicToastService },
      { provide: AuthLegaliyDialogUIProiderToken, useClass: AuthIonicLegalityDialogService }
    ]
})
export class AuthIonicModule {

}
