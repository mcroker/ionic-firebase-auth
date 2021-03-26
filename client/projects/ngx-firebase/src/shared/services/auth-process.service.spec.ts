import { AuthProcessService } from './auth-process.service';
import { FirestoreSyncService } from './firestore-sync.service';
import { AuthProvider, IAuthMergeUserService, malSharedConfigFactory, MalSharedConfig, ICredentialFactoryProvider } from '../interfaces';
import { AngularFireAuth } from '@angular/fire/auth';
import {
    MalInternalFakeAngularFireAuth,
    MalInternalFakeUserCredential, DUMMYAUTHERROR, MalInternalFakeUiService, MalInternalFakeFirebaseService
} from '../../test/fakes';
import { User, AuthCredential } from '@firebase/auth-types';
import { UiService } from './ui.service';
import { FirebaseService } from './firebase.service';

class FakeCredFactory implements ICredentialFactoryProvider {
    isProviderSupported(provider: AuthProvider): Promise<boolean> { return Promise.resolve(true) };
    getCredential(provider: AuthProvider): Promise<AuthCredential> { return Promise.resolve({} as AuthCredential); };
    signOut(): Promise<void> { return Promise.resolve(); };
}

describe('AuthProcessService', () => {

    let aps: AuthProcessService;
    let config: MalSharedConfig;
    let spyMergeUserService: jasmine.SpyObj<IAuthMergeUserService>;
    let spyCredFactory: jasmine.SpyObj<ICredentialFactoryProvider>;
    let spyFirestoreSyncService: jasmine.SpyObj<FirestoreSyncService>;
    let fakeAfa: AngularFireAuth & MalInternalFakeAngularFireAuth;
    let fakeUiService: MalInternalFakeUiService & UiService;
    let fakeFirebaseService: MalInternalFakeFirebaseService & FirebaseService;

    beforeEach(() => {

        config = malSharedConfigFactory({ firebase: null });
        spyMergeUserService = jasmine.createSpyObj('AuthMergeUserService', ['prepareSource', 'applyToTarget']);
        spyCredFactory = jasmine.createSpyObj(FakeCredFactory, ['getCredential', 'isProviderSupported']);
        spyCredFactory.isProviderSupported.and.resolveTo(false);
        spyFirestoreSyncService = jasmine.createSpyObj(FirestoreSyncService, ['getUserData', 'setUserData', 'updateUserData']);
        fakeAfa = MalInternalFakeAngularFireAuth.create();
        fakeUiService = MalInternalFakeUiService.create();
        fakeFirebaseService = MalInternalFakeFirebaseService.create();

        aps = new AuthProcessService(
            config,
            spyMergeUserService,
            spyCredFactory,
            spyFirestoreSyncService,
            fakeAfa,
            fakeFirebaseService,
            fakeUiService
        );

    });

    afterEach(() => {
        // No function should leave the spinner visible
        expect(fakeUiService.isLoadingVisible).toBeFalse();
    });

    it('should create', () => {
        expect(aps).toBeTruthy();
    });

    /** ********************************************************************************
     * Operations performed whilst user == null
     */
    describe('As an null user', async () => {

        describe('SignIn - anonymous', () => {

            it('Success', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential({ user: { isAnonymous: true } });
                fakeAfa.signInAnonymously.and.resolveTo(fakeCredResponse);
                const userCred = await aps.signInWith(AuthProvider.ANONYMOUS);
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeAfa.signInAnonymously).toHaveBeenCalled();
            });

        });

        describe('SignIn - email/password', async () => {

            it('SignIn Success', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                fakeAfa.signInWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, { credentials: { email: 'm@m.com', password: 'p' } });
                expect(userCred?.user?.displayName).toBe(fakeCredResponse.user.displayName);
            });

            it('signInWith throws unrecognised error', async () => {
                fakeAfa.signInWithEmailAndPassword.and.rejectWith(DUMMYAUTHERROR.notFound);
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, { credentials: { email: 'm@m.com', password: 'p' } });
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
            });

            // These should not record a crashlytics exception
            it('Fails username criteria');
            it('Wrong password');
            it('User not found');

            it('Account not verified');
        });

        describe('Register - username/password', async () => {

            /**
             * On Registration success we expect:
             *   The succesful Credential to be returned
             *   The User to be send an email for verfification
             *   The Profile to be updated with the displayName provided in the call
             *   The FirestoreSync document to be created with the user's data
             *   The CurrentUser to be refreshed
             */
            it('Success', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                fakeAfa.createUserWithEmailAndPassword.and.callFake(async () => {
                    fakeAfa._user$.next(fakeCredResponse.user);
                    return fakeCredResponse;
                });
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'testDisplayName',
                    skipTosCheck: true
                });
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeUiService.confirmTos).not.toHaveBeenCalled();
                expect(fakeCredResponse.user.sendEmailVerification).toHaveBeenCalled();
                expect(fakeCredResponse.user.updateProfile).toHaveBeenCalledWith(
                    { displayName: 'testDisplayName', photoURL: undefined }
                );
                expect(spyFirestoreSyncService.updateUserData).toHaveBeenCalledWith(
                    fakeCredResponse.user.uid, { displayName: fakeCredResponse.user.displayName, email: undefined, photoURL: undefined }
                );
                expect(fakeAfa.updateCurrentUser).toHaveBeenCalled();
                expect(fakeAfa.createUserWithEmailAndPassword).toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).not.toHaveBeenCalled();
            });

            /**
             * TosCheck is invoked if either privacy URL or TOS url is specified
             */
            it('User rejects TOS', async () => {
                config.authUi.tosUrl = 'not empty';
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'testDisplayName'
                });
                fakeUiService.confirmTos.and.resolveTo(false);
                expect(userCred).toBeNull();
                expect(fakeUiService.confirmTos).toHaveBeenCalled();
                expect(fakeAfa.createUserWithEmailAndPassword).not.toHaveBeenCalled();
            });

            /**
             * TosCheck is invoked if either privacy URL or TOS url is specified
             */
            it('User rejects Privacy Policy', async () => {
                config.authUi.privacyPolicyUrl = 'not empty';
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'testDisplayName'
                });
                fakeUiService.confirmTos.and.resolveTo(false);
                expect(userCred).toBeNull();
                expect(fakeUiService.confirmTos).toHaveBeenCalled();
                expect(fakeAfa.createUserWithEmailAndPassword).not.toHaveBeenCalled();
            });

            /**
             * TosCheck is invoked if either privacy URL or TOS url is specified
             */
            it('User accepts Privacy Policy and/or ToS', async () => {
                config.authUi.privacyPolicyUrl = 'not empty';
                config.authUi.tosUrl = 'not empty';
                fakeUiService.confirmTos.and.resolveTo(true);
                const fakeCredResponse = new MalInternalFakeUserCredential();
                fakeAfa.createUserWithEmailAndPassword.and.callFake(async () => {
                    fakeAfa._user$.next(fakeCredResponse.user);
                    return fakeCredResponse;
                });
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'testDisplayName'
                });
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeAfa.createUserWithEmailAndPassword).toHaveBeenCalled();
            });

            /**
             * On parameter failure we expect a null response, with nothing having been done.
             */
            it('Credentials parameter missing', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                fakeAfa.createUserWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    displayName: 'displayName'
                });
                expect(userCred).toBeNull();
                expect(fakeAfa.createUserWithEmailAndPassword).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeCredResponse.user.sendEmailVerification).not.toHaveBeenCalled();
                expect(fakeCredResponse.user.updateProfile).not.toHaveBeenCalled();
                expect(spyFirestoreSyncService.updateUserData).not.toHaveBeenCalled();
            });

            /**
             * On parameter failure we expect a null response, with nothing having been done.
             */
            it('DisplayName parameter missing', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                fakeAfa.createUserWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' }
                });
                expect(userCred).toBeNull();
                expect(fakeAfa.createUserWithEmailAndPassword).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeCredResponse.user.sendEmailVerification).not.toHaveBeenCalled();
                expect(fakeCredResponse.user.updateProfile).not.toHaveBeenCalled();
                expect(spyFirestoreSyncService.updateUserData).not.toHaveBeenCalled();
            });

            /**
             * Where the createUserExpression throws an exception, we expect null to be returned
             * and no further action. Currently it doesn't matter what the exception is.
             */
            it('Email badly formatted');
            it('Weak password');
            it('Email address already used');
            it('firebase.createWithUserAndPassword throws', async () => {
                fakeAfa.createUserWithEmailAndPassword.and.rejectWith(DUMMYAUTHERROR.notFound);
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'displayName'
                });
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.createUserWithEmailAndPassword).toHaveBeenCalled();
                expect(spyFirestoreSyncService.updateUserData).not.toHaveBeenCalled();
            });

        });

        describe('Register - social (web)', async () => {

            it('Success (sparse userData)', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                fakeAfa.signInWithPopup.and.callFake(async () => {
                    fakeAfa._user$.next(fakeCredResponse.user);
                    return fakeCredResponse;
                });
                const userCred = await aps.registerWith(AuthProvider.Facebook);
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeCredResponse.user.sendEmailVerification).not.toHaveBeenCalled();
                expect(fakeCredResponse.user.updateProfile).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).not.toHaveBeenCalled();
            });

            it('Success (all userData)', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential({
                    user: {
                        email: 'm@m',
                        phoneNumber: '12345',
                        photoURL: 'http://www.myphotourl.com',
                        providerId: 'firebase-facebook'
                    }
                });
                fakeUiService.confirmTos.and.resolveTo(true);
                fakeAfa.signInWithPopup.and.callFake(async () => {
                    fakeAfa._user$.next(fakeCredResponse.user);
                    return fakeCredResponse;
                });
                const userCred = await aps.registerWith(AuthProvider.Facebook);
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeCredResponse.user.sendEmailVerification).not.toHaveBeenCalled();
                expect(fakeCredResponse.user.updateProfile).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).not.toHaveBeenCalled();
            });

            it('Success - account already exists (same provider)');
            it('Success - account already exists (different provider)');
            it('Social provider is not supported');
            it('Email address already used');
        });

        describe('Invalid operations', async () => {
            it('Logout');
            it('Change user details');
            it('Delete user');
        });

    });

    /** ********************************************************************************
     * Operaitons performed whilst user != null, but user.isAnonymous == true
     */
    describe('As an anoymous user', async () => {

        let fakeCurrentUser: jasmine.SpyObj<User>;

        beforeEach(() => {
            fakeCurrentUser = new MalInternalFakeUserCredential({ user: { isAnonymous: true } }).user;
            fakeAfa._user$.next(fakeCurrentUser);
        });

        describe('SignIn - anonymous', () => {

            it('Throw Error - not allowed', async () => {
                const userCred = await aps.signInWith(AuthProvider.ANONYMOUS);
                expect(userCred).toBeNull();
                expect(fakeAfa.signInAnonymously).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
            });

        });

        describe('SignIn - username/password', () => {

            it('Success', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                spyMergeUserService.prepareSource.and.resolveTo(true);
                fakeAfa.signInWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' }
                });
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeFirebaseService.recordException).not.toHaveBeenCalled();
                expect(spyMergeUserService.prepareSource).toHaveBeenCalled();
                expect(spyMergeUserService.applyToTarget).toHaveBeenCalled();
            });

            /**
             * SignIn continues, but Merge part 2 not called
             */
            it('Merge returns null', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                spyMergeUserService.prepareSource.and.resolveTo(null);
                fakeAfa.signInWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' }
                });
                expect(userCred).toBe(fakeCredResponse);
                expect(fakeFirebaseService.recordException).not.toHaveBeenCalled();
                expect(spyMergeUserService.prepareSource).toHaveBeenCalled();
                expect(spyMergeUserService.applyToTarget).not.toHaveBeenCalled();
            });

            /**
             * If prepareSource fails, then we want to abort the login so as not to lose the
             * user's data.
             */
            it('Merge Part 1 (prepareSource) Fails', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                spyMergeUserService.prepareSource.and.rejectWith();
                fakeAfa.signInWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' }
                });
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.signInWithEmailAndPassword).not.toHaveBeenCalled();
                expect(spyMergeUserService.prepareSource).toHaveBeenCalled();
                expect(spyMergeUserService.applyToTarget).not.toHaveBeenCalled();
            });

            /**
             * If merge Part 2, then we have little choice but to plow on.  The onus for handling
             * failure needs to sit within MergeServide.
             */
            it('Merge Part 2 (applyToTarget) Fails', async () => {
                const fakeCredResponse = new MalInternalFakeUserCredential();
                spyMergeUserService.applyToTarget.and.rejectWith();
                spyMergeUserService.prepareSource.and.resolveTo(true);
                fakeAfa.signInWithEmailAndPassword.and.resolveTo(fakeCredResponse);
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' }
                });
                expect(userCred).toEqual(fakeCredResponse);
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(spyMergeUserService.prepareSource).toHaveBeenCalled();
                expect(spyMergeUserService.applyToTarget).toHaveBeenCalled();
            });

        });

        describe('SignIn - social (web)', async () => {
            it('Success');
            it('Merge Fails');
        });

        describe('Register - username/password', async () => {
            it('Success');
        });

        describe('Register - social', async () => {
            it('Success - first login');
            it('Success - account already exists (same provider)');
            it('Success - account already exists (different provider)');
            it('Social provider is not supported');
            it('Email address already used');
        });

        describe('Logout', async () => {
            it('Success');
        });

        describe('Delete user', async () => {
        });

        describe('Invalid operations', async () => {
            it('Change user details');
        });

    });

    /** ********************************************************************************
     * Operaitons performed whilst user != null, and user.isAnonymous != true
     */
    describe('As an named user', async () => {

        let fakeCurrentUser: jasmine.SpyObj<User>;

        beforeEach(() => {
            fakeCurrentUser = new MalInternalFakeUserCredential().user;
            fakeAfa._user$.next(fakeCurrentUser);
        });

        describe('SignIn whilst SignedIn', () => {

            it('SignIn - anonymous', async () => {
                const userCred = await aps.signInWith(AuthProvider.ANONYMOUS);
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.signInAnonymously).not.toHaveBeenCalled();
                expect(fakeAfa.signInWithEmailAndPassword).not.toHaveBeenCalled();
                expect(fakeAfa.signInWithPopup).not.toHaveBeenCalled();
            });

            it('SignIn - email/password', async () => {
                const userCred = await aps.signInWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' }
                });
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.signInAnonymously).not.toHaveBeenCalled();
                expect(fakeAfa.signInWithEmailAndPassword).not.toHaveBeenCalled();
                expect(fakeAfa.signInWithPopup).not.toHaveBeenCalled();
            });

            it('SignIn - social (web)', async () => {
                const userCred = await aps.signInWith(AuthProvider.Facebook);
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.signInAnonymously).not.toHaveBeenCalled();
                expect(fakeAfa.signInWithEmailAndPassword).not.toHaveBeenCalled();
                expect(fakeAfa.signInWithPopup).not.toHaveBeenCalled();
            });

        });

        describe('Register whilst Signed-In', () => {

            it('Register - email/password', async () => {
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'testDisplayName',
                    skipTosCheck: true
                });
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.createUserWithEmailAndPassword).not.toHaveBeenCalled();
                expect(fakeUiService.confirmTos).not.toHaveBeenCalled();
                expect(spyFirestoreSyncService.updateUserData).not.toHaveBeenCalled();
                expect(fakeAfa.updateCurrentUser).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
            });

            it('Register - social (web)', async () => {
                const userCred = await aps.registerWith(AuthProvider.EmailAndPassword, {
                    credentials: { email: 'm@m.com', password: 'p' },
                    displayName: 'testDisplayName',
                    skipTosCheck: true
                });
                expect(userCred).toBeNull();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
                expect(fakeAfa.signInWithPopup).not.toHaveBeenCalled();
                expect(fakeUiService.confirmTos).not.toHaveBeenCalled();
                expect(spyFirestoreSyncService.updateUserData).not.toHaveBeenCalled();
                expect(fakeAfa.updateCurrentUser).not.toHaveBeenCalled();
                expect(fakeFirebaseService.recordException).toHaveBeenCalled();
            });

            it('Register - social (device)');

        });

        describe('Attach Auth provider', async () => {
            it('Email/password');
            it('Social');
        });

        describe('User Operations', async () => {

            it('SignOut (web)', async () => {
                await aps.signOut();
                expect(fakeAfa.signOut).toHaveBeenCalled();
                expect(aps.user).toBeNull();
            });

            it('SignOut (device)');

            it('Delete User', async () => {
                fakeCurrentUser.delete.and.callFake(async () => fakeAfa._user$.next(null));
                await aps.deleteUser();
                expect(fakeCurrentUser.delete).toHaveBeenCalled();
                expect(aps.user).toBeNull();
            });

            // tslint:disable-next-line max-line-length
            // {code: "auth/requires-recent-login", message: "This operation is sensitive and requires recent authentication. Log in again before retrying this request.", a: null}
            /**
             * In the event that re-authentication is required. We expect no deleteUser actions to take place
             * and the deleteUser promise to be rejected
             */
            it('Delete User - recent authentication required', async () => {
                fakeCurrentUser.delete.and.rejectWith(DUMMYAUTHERROR.requiresRecentLogin);
                await expectAsync(aps.deleteUser()).toBeRejectedWith(DUMMYAUTHERROR.requiresRecentLogin);
                expect(fakeCurrentUser.delete).toHaveBeenCalled();
                expect(aps.user).toBe(fakeCurrentUser);
            });

            it('Change User Email');
            it('Change User DisplayName');
            it('Change User photoURL');
            it('password Reset');
        });

    });

});
