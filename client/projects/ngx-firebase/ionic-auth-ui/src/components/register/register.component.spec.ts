import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUIRegisterComponent } from './register.component';
import { AuthProcessService } from 'ngx-firebase';
import { MalTestingModule } from '../../../../testing';

import { AuthProvidersComponent } from '../providers/providers.component';
import { MalIonicUISharedModule } from '../../ionic-auth-ui-shared.module';

describe('AuthUIRegisterComponent', () => {
  let component: AuthUIRegisterComponent;
  let fixture: ComponentFixture<AuthUIRegisterComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        MalTestingModule,
        MalIonicUISharedModule
      ],
      declarations: [
        AuthProvidersComponent,
        AuthUIRegisterComponent
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AuthUIRegisterComponent);
        component = fixture.componentInstance;

        // AuthService provided by Component, (should return MockAuthService)
        componentService = fixture.debugElement.injector.get(AuthProcessService);

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('email field validity', () => {
    let errors = {};
    const email = component.registerForm.controls['email'];
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(email.valid).toBeFalsy();

    email.setValue('test');
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['email']).toBeTruthy();
  });

  it('password field validity', () => {
    let errors = {};
    const password = component.registerForm.controls['password'];
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(password.valid).toBeFalsy();

    password.setValue('test');
    password.setValue('test');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('register form validity', () => {
    expect(component.registerForm.valid).toBeFalsy();
    component.registerForm.controls['name'].setValue('Test XYZ');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('123456789');
    component.registerForm.controls['passwordConfirm'].setValue('123456789');
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should create account button be disabled if the register form is invalid', () => {
    const createAccountButton: DebugElement = fixture.debugElement.query(By.css('#createAccountButton'));
    expect(createAccountButton.nativeElement.disabled).toBeTruthy();
  });

  it('should create button be enabled if the register form is valid', () => {
    const createAccountButton: DebugElement = fixture.debugElement.query(By.css('#createAccountButton'));
    component.registerForm.controls['name'].setValue('Test XYZ');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('123456789');
    component.registerForm.controls['passwordConfirm'].setValue('123456789');
    fixture.detectChanges();
    expect(createAccountButton.nativeElement.disabled).toBeFalsy();
  });

  it('should trigger onLoginRequested event when its requested via the login button', () => {
    const createAccountButton = fixture.nativeElement.querySelector('#loginButton');
    spyOn(component.onLoginRequested, 'emit');
    createAccountButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.onLoginRequested.emit).toHaveBeenCalled();

  });
  */

});
