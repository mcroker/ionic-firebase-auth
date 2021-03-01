import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPopoverMenuComponent } from './popover-menu.component';
import { IonicModule } from '@ionic/angular';

describe('AuthPopoverMenuComponent', () => {
  let component: AuthPopoverMenuComponent;
  let fixture: ComponentFixture<AuthPopoverMenuComponent>;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        IonicModule
      ],
      declarations: [
        AuthPopoverMenuComponent
      ]
    })
      .compileComponents().then(() => {

        fixture = TestBed.createComponent(AuthPopoverMenuComponent);
        component = fixture.componentInstance;

        // component.ngOnInit();
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
