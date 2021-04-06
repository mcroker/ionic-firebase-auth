import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthAvatarComponent } from './avatar.component';
import { IonicModule } from '@ionic/angular';
import {AuthTestingModule } from 'ionic-firebase-auth/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthAvatarComponent', () => {
  let component: AuthAvatarComponent;
  let fixture: ComponentFixture<AuthAvatarComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        RouterTestingModule,
        AuthTestingModule
      ],
      declarations: [
        AuthAvatarComponent
      ]
    })
      .compileComponents().then(() => {

        fixture = TestBed.createComponent(AuthAvatarComponent);
        component = fixture.componentInstance;

        // component.ngOnInit();
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
