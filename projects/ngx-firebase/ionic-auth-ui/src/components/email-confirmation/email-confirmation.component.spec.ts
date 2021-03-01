// import 'core-js/es7/reflect'; // needed for unit testing
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmationComponent } from './email-confirmation.component';
import { AuthProcessService } from 'ngx-firebase';
import { MalTestingModule } from '../../../../testing';
import { MalIonicUISharedModule } from '../../ionic-auth-ui-shared.module';

describe('EmailConfirmationComponent', () => {
  let component: EmailConfirmationComponent;
  let fixture: ComponentFixture<EmailConfirmationComponent>;
  let componentService: AuthProcessService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        MalTestingModule,
        MalIonicUISharedModule
      ],
      declarations: [
        EmailConfirmationComponent
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EmailConfirmationComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);
      fixture.detectChanges();
    });
  });

  it('should create components', () => expect(component).toBeDefined());

});
