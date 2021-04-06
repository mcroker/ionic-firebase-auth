import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUIUserComponent } from './user.component';
import { AuthTestingModule } from '../../../../testing';

describe('UserComponent', () => {
  let component: AuthUIUserComponent;
  let fixture: ComponentFixture<AuthUIUserComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AuthUIUserComponent],
      imports: [
        AuthTestingModule
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
