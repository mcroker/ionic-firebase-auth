import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthProcessService } from 'ionic-firebase-auth';
import { AuthTestingModule } from 'ionic-firebase-auth/testing';

import { AuthUIEmailFieldComponent } from './email-field.component';
import { AuthUIFormFieldComponent } from '../form-field/form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AuthUIEmailFieldComponent', () => {
  let component: AuthUIEmailFieldComponent;
  let fixture: ComponentFixture<AuthUIEmailFieldComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        AuthTestingModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AuthUIEmailFieldComponent,
        AuthUIFormFieldComponent
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthUIEmailFieldComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);
      fixture.detectChanges();
    });
  });

  it('should create components', () => expect(component).toBeDefined());

});
