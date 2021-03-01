import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthAvatarComponent } from './avatar.component';
import { AuthProcessService, CrashlyticsService, MalToastUIProviderToken } from 'ngx-firebase';
import { IonicModule } from '@ionic/angular';
import {MalTestingModule } from 'ngx-firebase/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {  } from 'projects/ngx-firebase/testing';

describe('AuthAvatarComponent', () => {
  let component: AuthAvatarComponent;
  let fixture: ComponentFixture<AuthAvatarComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        RouterTestingModule,
        MalTestingModule
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
