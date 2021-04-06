import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserCredential, AuthProvider as FirebaseAuthProvider } from '@firebase/auth-types';
import { AngularFireAuth } from '@angular/fire/auth';
import { v4 as uuid } from 'uuid';

export class AuthInternalFakeUserCredential {
    credential = null;
    user: jasmine.SpyObj<User> = {
        uid: uuid(),
        displayName: uuid(),
        isAnonymous: false,
        sendEmailVerification: jasmine.createSpy<() => Promise<void>>('sendEmailVerification'),
        updateProfile: jasmine.createSpy<(profile: { displayName?: string | null; photoURL?: string | null; }) => Promise<void>>('updateProfile'),
        delete: jasmine.createSpy<() => Promise<void>>('delete')
    } as any;

    constructor(data?: {
        user?: Partial<User>
    }) {
        if (data && data?.user) {
            Object.assign(this.user, data.user);
        }
    }

}

export const DUMMYAUTHERROR = {
    notFound: { code: 'auth/user-not-found', message: 'There is no user record corresponding to this identifier. The user may have been deleted.', a: null },
    emailBadlyFormatted: { code: 'auth/invalid-email', message: 'The email address is badly formatted.', a: null },
    weakPassword: { code: 'auth/weak-password', message: 'Password should be at least 6 characters', a: null },
    requiresRecentLogin: { code: 'auth/requires-recent-login', message: 'This operation is sensitive and requires recent authentication. Log in again before retrying this request.', a: null }
};

declare type SignInWithEmailAndPasswordFn = (email: string, password: string) => Promise<UserCredential>;
declare type SignInAnonymouslyFn = () => Promise<UserCredential>;
declare type CreateUserWithEmailAndPasswordFn = (email: string, password: string) => Promise<UserCredential>;
declare type SignInWithPopupFn = (provider: FirebaseAuthProvider) => Promise<UserCredential>;
declare type UpdateCurrentUserFn = (user: User) => Promise<void>;
declare type SignOutFn = () => Promise<void>;
declare type sendPasswordResetEmailFn = (email: string) => Promise<void>;
declare type SignInWithCredentialFn = (credential: UserCredential) => Promise<void>;

export class AuthInternalFakeAngularFireAuth {

    get authState(): Observable<User | null> { return this._authState$.asObservable(); }
    readonly _authState$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    get user(): Observable<User | null> { return this._user$.asObservable(); }
    get currentUser(): Promise<User | null> { return Promise.resolve(this._user$.value); }
    readonly _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    signInWithEmailAndPassword: jasmine.Spy<SignInWithEmailAndPasswordFn> = jasmine.createSpy('signInWithEmailAndPassword');
    signInWithPopup: jasmine.Spy<SignInWithPopupFn> = jasmine.createSpy('signInWithPopup');
    signInAnonymously: jasmine.Spy<SignInAnonymouslyFn> = jasmine.createSpy('signInAnonymously');
    createUserWithEmailAndPassword: jasmine.Spy<CreateUserWithEmailAndPasswordFn> = jasmine.createSpy('createUserWithEmailAndPassword');
    updateCurrentUser: jasmine.Spy<UpdateCurrentUserFn> = jasmine.createSpy('updateCurrentUser');
    signOut: jasmine.Spy<SignOutFn> = jasmine.createSpy('signOut');
    sendPasswordResetEmail: jasmine.Spy<sendPasswordResetEmailFn> = jasmine.createSpy('sendPasswordResetEmail');
    signInWithCredential: jasmine.Spy<SignInWithCredentialFn> = jasmine.createSpy('signInWithCredential');

    constructor() {
        this.signOut.and.callFake(async () => this._user$.next(null));
    }

    static create(): AngularFireAuth & AuthInternalFakeAngularFireAuth {
        return new AuthInternalFakeAngularFireAuth() as any as AuthInternalFakeAngularFireAuth & AngularFireAuth;
    }

}
