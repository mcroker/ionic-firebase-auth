// @angular/*
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'

// Ionic
import { IonicModule } from '@ionic/angular';

// Mal
import { MalSharedModule } from 'ngx-firebase';

// components
import { AuthAvatarComponent } from './components/avatar/avatar.component';
import { AuthPopoverMenuComponent } from './components/popover-menu';

// services
import { MalIonicAlertsService } from './services/alerts-ionic.service';
import { MalIonicLoadingService } from './services/loading-ionic.service';
import { MalIonicPickerService } from './services/picker-ionic.service';
import { MalIonicToastService } from './services/toast-ionic.service';
import { MalIonicLegalityDialogService } from './services/legality-dialog-ionic.service';
// interfaces
import {
  MalToastUIProviderToken, MalAlertsUIProviderToken, MalLoadingUIProviderToken,
  MalPickerUIProviderToken, MalLegaliyDialogUIProiderToken
} from 'ngx-firebase';
// pages

const COMPONENTS = [
  AuthAvatarComponent,
  AuthPopoverMenuComponent
];

@NgModule({
  imports: [
    MalSharedModule,
    CommonModule,
    HttpClientModule,
    IonicModule
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
  providers:
    [
      { provide: MalAlertsUIProviderToken, useClass: MalIonicAlertsService },
      { provide: MalLoadingUIProviderToken, useClass: MalIonicLoadingService },
      { provide: MalPickerUIProviderToken, useClass: MalIonicPickerService },
      { provide: MalToastUIProviderToken, useClass: MalIonicToastService },
      { provide: MalLegaliyDialogUIProiderToken, useClass: MalIonicLegalityDialogService }
    ]
})
export class MalIonicModule {

}
