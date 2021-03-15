import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuthProvidersComponent, Layout } from './providers.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthProvider } from 'ngx-firebase';
import { BehaviorSubject } from 'rxjs';
import { MalTestingModule } from 'ngx-firebase/testing';

describe('AuthProvidersComponent', () => {
  let comp: AuthProvidersComponent;
  let fixture: ComponentFixture<AuthProvidersComponent>;

  const credentialsMock = {
    email: 'abc@123.com',
    password: 'password'
  };

  const userMock = {
    uid: 'ABC123',
    email: credentialsMock.email,
  };

  const fakeAuthState = new BehaviorSubject(null); // <= Pay attention to this guy

  const mockSignInHandler = (email: any, password: any): Promise<any> => {
    fakeAuthState.next(userMock);
    return Promise.resolve(userMock);
  };

  const mockSignOutHandler = (): Promise<any> => {
    fakeAuthState.next(null);
    return Promise.resolve();
  };

  const angularFireAuthStub = {
    authState: fakeAuthState,
    auth: {
      createUserWithEmailAndPassword: jasmine
        .createSpy('createUserWithEmailAndPassword')
        .and
        .callFake(mockSignInHandler),
      signInWithEmailAndPassword: jasmine
        .createSpy('signInWithEmailAndPassword')
        .and
        .callFake(mockSignInHandler),
      signOut: jasmine
        .createSpy('signOut')
        .and
        .callFake(mockSignOutHandler),
    },
  };

  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise<void>((resolve, _reject) => resolve()),
      }),
    }),
  };

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        MalTestingModule,
        FlexLayoutModule
      ],
      declarations: [AuthProvidersComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthProvidersComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create components', () => expect(comp).toBeDefined());

  it('should have a layout input', () => {
    expect(comp.layout).toEqual(Layout.ROW);
  });

  it('should have a providers input', () => {
    expect(comp.providers).toEqual(AuthProvider.ALL);
  });

  /*
  it('should create by default all available providers button', () => {
    const div = fixture.debugElement.query(By.all());
    expect(div.name).toEqual('div');
    // should create the 6 buttons
    expect(div.children[0].children.length).toBe(6);
    // console.log('div.children.length', div.children[0].children.length);

    for (const child of div.children[0].children) {
      // console.log('child', child);
      expect(child.name).toEqual('button');
      expect('mat-button' in child.attributes).toBeTruthy();

      const span = child.children.filter(spanChild => spanChild.name === 'span');
      expect(span).toBeTruthy();

      const matIcon = span[0].query(By.css('.mat-icon'));

      expect(matIcon).toBeTruthy();

      const svg = matIcon.nativeElement;

      // expect(svg).toBeTruthy();
      // console.log('svg', svg);
    }
  });
  */

  // it('should create by default a google button', () => {
  //   let el = fixture.debugElement.query(By.css('.mat-button'));

  // console.log('el: ', el);
  // console.log('el: ', el.nativeElement.innerHTML);
  // console.log('el: ', el.nativeElement.querySelector('span').innerHTML);
  // });
});
