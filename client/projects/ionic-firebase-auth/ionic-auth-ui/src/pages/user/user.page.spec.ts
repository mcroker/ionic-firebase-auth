import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MalIonicAuthUiModule } from '../../ionic-auth-ui.module';
import { AuthTestingModule } from '../../../../testing';
import { AuthUserPage } from './user.page';

describe('AuthUserPage', () => {
  let component: AuthUserPage;
  let fixture: ComponentFixture<AuthUserPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AuthUserPage],
      imports: [
        AuthTestingModule,
        MalIonicAuthUiModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
