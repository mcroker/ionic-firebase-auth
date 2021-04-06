import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MalIonicAuthUiModule } from '../../ionic-auth-ui.module';
import { MalTestingModule } from '../../../../testing';
import { AuthSignInPage } from './signin.page';

describe('AuthSignInPage', () => {
  let component: AuthSignInPage;
  let fixture: ComponentFixture<AuthSignInPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AuthSignInPage],
      imports: [
        MalTestingModule,
        MalIonicAuthUiModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
