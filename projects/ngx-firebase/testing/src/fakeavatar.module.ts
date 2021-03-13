// Angular
import { NgModule } from '@angular/core';
import { MalTestingModule } from 'ngx-firebase/testing/test.module';
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
    MalTestingModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class MalFakeAvatarModule { }
