import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUIUserComponent } from './user.component';
import { MalTestingModule } from '../../../../testing';
import { MalIonicUISharedModule } from '../../ionic-auth-ui-shared.module';

describe('UserComponent', () => {
  let component: AuthUIUserComponent;
  let fixture: ComponentFixture<AuthUIUserComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AuthUIUserComponent],
      imports: [
        MalTestingModule,
        MalIonicUISharedModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthUIUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
