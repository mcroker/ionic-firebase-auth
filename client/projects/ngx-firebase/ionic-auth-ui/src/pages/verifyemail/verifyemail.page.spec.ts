import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MalTestingModule } from 'ngx-firebase/testing';

import { AuthVerifyEmailPage } from './verifyemail.page';

describe('AuthVerifyEmailPage', () => {
  let component: AuthVerifyEmailPage;
  let fixture: ComponentFixture<AuthVerifyEmailPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AuthVerifyEmailPage],
      imports: [
        MalTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthVerifyEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
