import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUISignInComponent } from './signin.component';
import { AuthProcessService } from 'ionic-firebase-auth';
import { AuthTestingModule } from 'ionic-firebase-auth/testing';


describe('AuthUISignInComponent', () => {
  let component: AuthUISignInComponent;
  let fixture: ComponentFixture<AuthUISignInComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        AuthTestingModule
      ],
      declarations: [
        AuthUISignInComponent
      ],
    })
      .compileComponents().then(() => {

        fixture = TestBed.createComponent(AuthUISignInComponent);
        component = fixture.componentInstance;

        // AuthService provided by Component, (should return MockAuthService)
        componentService = fixture.debugElement.injector.get(AuthProcessService);

        // component.ngOnInit();
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('email field validity', () => {
    let errors = {};
    const email = component.loginForm.controls['email'];
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
    const password = component.loginForm.controls['password'];
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(password.valid).toBeFalsy();

    password.setValue('test');
    password.setValue('test');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('login form validity', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('123456789');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should login button be disabled if the login form is invalid', () => {
    const loginButton: DebugElement = fixture.debugElement.query(By.css('#loginButton'));
    expect(loginButton.nativeElement.disabled).toBeTruthy();
    console.log('loginButton', loginButton);
  });

  it('should login button be enabled if the login form is valid', () => {
    const loginButton: DebugElement = fixture.debugElement.query(By.css('#loginButton'));
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('123456789');
    fixture.detectChanges();
    expect(loginButton.nativeElement.disabled).toBeFalsy();
  });

  it('should trigger onCreateAccountRequested event when its requested via create account button', () => {
    const createAccountButton = fixture.nativeElement.querySelector('#createAccountButton');
    spyOn(component.onCreateAccountRequested, 'emit');
    createAccountButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.onCreateAccountRequested.emit).toHaveBeenCalled();

  });
  */
});
