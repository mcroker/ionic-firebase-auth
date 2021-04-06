import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUIReauthenticateComponent } from './reauthenticate.component';
import { AuthProcessService } from 'ionic-firebase-auth';
import { AuthTestingModule } from '../../../../testing';


describe('AuthUIReauthenticateComponent', () => {
  let component: AuthUIReauthenticateComponent;
  let fixture: ComponentFixture<AuthUIReauthenticateComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        AuthTestingModule
      ],
      declarations: [
        AuthUIReauthenticateComponent
      ],
    })
      .compileComponents().then(() => {

        fixture = TestBed.createComponent(AuthUIReauthenticateComponent);
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

});
