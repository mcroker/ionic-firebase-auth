// import 'core-js/es7/reflect'; // needed for unit testing
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEmailConfirmationComponent } from './email-confirmation.component';
import { AuthProcessService } from 'ionic-firebase-auth';
import { AuthTestingModule } from '../../../../testing';

describe('EmailConfirmationComponent', () => {
  let component: AuthEmailConfirmationComponent;
  let fixture: ComponentFixture<AuthEmailConfirmationComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        AuthTestingModule
      ],
      declarations: [
        AuthEmailConfirmationComponent
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthEmailConfirmationComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);
      fixture.detectChanges();
    });
  });

  it('should create components', () => expect(component).toBeDefined());

});
