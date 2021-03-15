import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared.module';
import { MalTestingModule } from 'ngx-firebase/testing';

import { AppComponent } from './app.component';
import { PersistState } from '@datorama/akita';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let persistStorage: jasmine.SpyObj<PersistState>;

  beforeEach(async () => {
    persistStorage = jasmine.createSpyObj('PersistState', [' clear']);
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        SharedModule,
        MalTestingModule
      ],
      providers: [
        { provide: 'persistStorage', useValue: persistStorage }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(async () => {
    await fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
