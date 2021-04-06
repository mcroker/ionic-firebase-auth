// Angular
import { NgModule } from '@angular/core';
import { AuthTestingModule } from './test.module';
// Fakes
import {
  FakeAvatarComponent
} from './fakes';

const COMPONENTS = [
  FakeAvatarComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    AuthTestingModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class AuthFakeAvatarModule { }
