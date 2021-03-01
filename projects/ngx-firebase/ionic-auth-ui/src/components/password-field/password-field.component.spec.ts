import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUIPasswordFieldComponent } from './password-field.component';
import { AuthProcessService } from 'ngx-firebase';
import { MalTestingModule } from 'ngx-firebase/testing';

import { AuthUIFormFieldComponent } from '../form-field/form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AuthUIPasswordFieldComponent', () => {
  let component: AuthUIPasswordFieldComponent;
  let fixture: ComponentFixture<AuthUIPasswordFieldComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        MalTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AuthUIPasswordFieldComponent,
        AuthUIFormFieldComponent
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthUIPasswordFieldComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);
      fixture.detectChanges();
    });
  });

  it('should create components', () => expect(component).toBeDefined());

});
