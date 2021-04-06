import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthProcessService } from 'ionic-firebase-auth';
import { MalTestingModule } from 'ionic-firebase-auth/testing';

import { AuthUIFormFieldComponent } from '../form-field/form-field.component';
import { AuthUINameFieldComponent } from './name-field.component';

describe('AuthUINameFieldComponent', () => {
  let component: AuthUINameFieldComponent;
  let fixture: ComponentFixture<AuthUINameFieldComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        MalTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AuthUINameFieldComponent,
        AuthUIFormFieldComponent
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthUINameFieldComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);
      fixture.detectChanges();
    });
  });

  it('should create components', () => expect(component).toBeDefined());

});
