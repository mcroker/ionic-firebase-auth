import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthProcessService } from 'ionic-firebase-auth';
import { MalTestingModule } from 'ionic-firebase-auth/testing';

import { AuthUIFormFieldComponent } from './form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AuthUIEmailFieldComponent', () => {
  let component: AuthUIFormFieldComponent;
  let fixture: ComponentFixture<AuthUIFormFieldComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        MalTestingModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AuthUIFormFieldComponent
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthUIFormFieldComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);
      fixture.detectChanges();
    });
  });

  it('should create components', () => expect(component).toBeDefined());

});
