// Angular
import { EventEmitter, forwardRef, Inject, Injectable, Optional } from '@angular/core';

// RXJS
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';

// Firebase & AngularFire
import { firebase } from '@firebase/app';
import 'firebase/auth';
import { User, UserInfo, UserCredential, AuthProvider as FirebaseAuthProvider, AuthCredential } from '@firebase/auth-types';
import { AngularFireAuth } from '@angular/fire/auth';

// Mal
import { AuthFirestoreSyncService } from './firestore-sync.service';
import {
  AuthCredentialFactoryProviderToken,
  AuthHooksProviderToken, AuthSharedConfigToken,
  AuthSharedConfig, AuthProvider, ISignInOptions, Accounts, IAuthHooksService,
  ICredentialFactoryProvider, FirebaseErrorCodes
} from '../interfaces';
import { UiService } from './ui.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthProcessService {

  public readonly onErrorEmitter: EventEmitter<any> = new EventEmitter<any>();
  public readonly onSignInEmitter: EventEmitter<User> = new EventEmitter<User>();
  public readonly onRegisterEmitter: EventEmitter<User> = new EventEmitter<User>();
  public readonly onSignOutEmitter: EventEmitter<void> = new EventEmitter<void>();
  public readonly onUserUpdatedEmitter: EventEmitter<UserInfo> = new EventEmitter<UserInfo>();
  public readonly onUserDeletedEmitter: EventEmitter<void> = new EventEmitter<void>();
  public readonly showProfileDialog: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Useful to know about auth state even between reloads.
   *
   **/
  private _user$ = new BehaviorSubject<User | null>(null);
  get user(): User | null {
    return this._user$.value;
  }

  public readonly user$ = this.afa.user;

  /**
   * Useful to know about auth state even between reloads.
   **/
  private _authState$ = new BehaviorSubject<User | null>(null);
  public readonly authState$ = this.afa.authState;

  /**
   * Obersable for current user - that only emits when the uid changes
   * Useful to reset session info when user changes.
   */
  public uid$: Observable<string | null> =
    this.user$.pipe(
      map(user => user?.uid || null),
      distinctUntilChanged()
    );

  /**
   * UserInterface helper observables - indicating what user actions are currently permitted and
   * the current status of authentication.
   */
  public readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => null !== user));
  public readonly isAnonymous$: Observable<boolean> = this.user$.pipe(map(user => null !== user && user.isAnonymous));
  public readonly isNamedUser$: Observable<boolean> = this.user$.pipe(map(user => null !== user && !user.isAnonymous));
  public readonly isNotNamedUser$: Observable<boolean> = this.user$.pipe(map(user => null === user || user.isAnonymous));
  public readonly canEdit$ = this.isLoggedIn$;
  public readonly canRegister$: Observable<boolean> = this.isNotNamedUser$;
  public readonly canSignIn$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));
  public readonly canSignInAsGuest$: Observable<boolean> =
    this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn && this.config.authUi.guestEnabled));
  public readonly canSignOut$: Observable<boolean> = this.isNamedUser$;

  /**
   * Observable. Emits whenever currentUser signsOut
   */
  public readonly onSignOut$: Observable<void> = this.authState$.pipe(
    filter(user => user === null),
    map(() => { return; })
  );

  /**
   * Observable emits whenever a new user signsIn
   */
  public readonly onSignIn$: Observable<User> = this.authState$.pipe(
    filter(user => null !== user),
    map(user => user as User)
  );

  /**
   * Provides an array of authentication providers that are valid for the currently signed-in user
   */
  public get reauthenticateProviders$(): Observable<AuthProvider[]> {
    return this.user$.pipe(
      map(user => (user?.providerData || [])
        .map(item => {
          switch (item?.providerId) {
            case 'google.com': return AuthProvider.Google;
            default: console.log('NO MATCH', item); return;
          }
        })
        .filter(item => !!item) as AuthProvider[]
      )
    );
  }

  /**
   * Triggers subscriber actions when the current user token is refreshed
   */
  private readonly tokenRefreshed$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(forwardRef(() => AuthSharedConfigToken)) public config: AuthSharedConfig,
    @Optional() @Inject(forwardRef(() => AuthHooksProviderToken)) public hooksService: IAuthHooksService,
    @Optional() @Inject(forwardRef(() => AuthCredentialFactoryProviderToken)) public credFactory: ICredentialFactoryProvider,
    private fireStoreService: AuthFirestoreSyncService,
    private afa: AngularFireAuth, // TODO should be private
    private fire: FirebaseService,
    private ui: UiService
  ) {
    this.afa.user.subscribe(user => this._user$.next(user));
    this.afa.authState.subscribe(authState => this._authState$.next(authState));
    this.authState$.subscribe(user => {
      this.fire.setUserId(user?.uid || null);
    });
    this.onSignOut$.subscribe(() => this.onSignOutEmitter.emit());
  }

  /**
   * Returns true if current platform is webplatform supported by @angular/fire
   */
  get isWebPlatform(): boolean {
    return ['https:', 'http:', 'chrome-extension'].includes(location.protocol);
  }

  /**
   * Indicates if the specified provider is supported on the current platform
   * 
   * A provider is supported if it is configured to be so in authUi.supportProviders and either the platform is a webplatform
   * (in which case @anguluar/fire will be used). Or the provider is supported by the injected credFactory (such as that provided by /capacitor).
   */
  async isProviderSupported(provider: AuthProvider): Promise<boolean> {
    const configSupported = (this.config.authUi.supportedProviders === AuthProvider.ALL || this.config.authUi.supportedProviders.includes(provider));
    const credFactorySupported = (!!this.credFactory) ? await this.credFactory.isProviderSupported(provider) : false;
    return configSupported && ((this.isWebPlatform && false !== credFactorySupported) || (true === credFactorySupported));
  }

  /**
   * Refreshes the current user IdToken, and triggers the tokenRefreshed$ subject
   */
  public async refreshToken(): Promise<void> {
    const user = await this.afa.currentUser;
    if (user) {
      await user.getIdToken(true);
      await this.tokenRefreshed$.next();
    }
  }

  /**
   * Provides an observable that subscribes to the current user token and returns the value of the specified claim.
   * 
   * @param claim Claim to be returned
   * @returns Observable for: Value of claim within current user token || null (if not signed in) || undefined (if no such claim exists)
   */
  public selectCurrentUserClaim<T>(claim: string): Observable<T | null | undefined> {
    return new Observable<T | null | undefined>(subscriber => {
      // Handler function to process the ID token
      // Emits the claim || undefined || null
      const handleTokenRefresh = async (user: User | null) => {
        if (user) {
          const token = await user.getIdTokenResult();
          subscriber.next(token.claims[claim]);
        } else {
          subscriber.next(null);
        }
      };
      // Subscribe to token refresh events
      this.tokenRefreshed$.subscribe(async () => {
        const user = await this.afa.currentUser;
        await handleTokenRefresh(user);
      });
      // Subscribe to user update events
      this.afa.user.subscribe(async user => {
        await handleTokenRefresh(user);
      });
    });
  }

  /**
   * Get the value for a custom claim for the current user (extracted from their ID token)
   * 
   * @param claim Claim to be returned
   * @returns Value of claim within current user token || null (if not signed in) || undefined (if no such claim exists)
   */
  public getCurrentUserClaim<T>(claim: string): Promise<T | null | undefined> {
    return this.selectCurrentUserClaim<T>(claim).pipe(take(1)).toPromise();
  }

  /**
   * Reset the password of currently authenticated user via email,
   * Firebase sends an email to the user - and managed the reset process directly via google's hosted pages.
   *
   * @param email - the email to reset
   */
  public async resetPassword(email: string): Promise<void> {
    try {
      this.fire.addLogMessage('Password reset email sent');
      this.afa.sendPasswordResetEmail(email);
      this.ui.toast(
        'auth.resetPassword.onResetRequestedTo',
        { duration: this.config.authUi.toastDefaultDurationMil, interpolateParams: { email }, position: 'bottom' }
      );
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * General sign in mechanism to authenticate the users with a firebase project
   * using a traditional way, via username and password or by using an authentication provider
   * like google, facebook, twitter and github
   *
   * [Current State -> Target State]
   *   Null -> Anon/named: OK
   *   Anon -> Anon: Throws Error
   *   Anon -> Named: Triggers MergeService
   *   Named -> Any: Throws Error
   *
   * @param provider - the provider to authenticate with (google, facebook, twitter, github)
   * @param credentials optional email and password
   */
  public async signInWith(provider: AuthProvider, options?: ISignInOptions): Promise<UserCredential | null> {

    this.fire.addLogMessage(`SignInWithProvider; provider=${provider}`);
    const loading = await this.ui.createLoading();
    try {
      let userCred: UserCredential | null = null;

      const currentUser = await this.afa.currentUser;

      // Trigger hook for user merge where an anonymoust user >>> non-anonymous user.
      // Two merge hooks are provided, one run as source user (prepareMergeSource) and once the new non-anonymous user is created
      // a second hook applyMergeToTarget is subsequenrly run. The output from prepareMergeSource is passed into applyMergeToTarget.
      // Don't catch any errors, so they are caught by function and trigger a login abort.
      let mergeContext: any = null;
      if (currentUser && currentUser.isAnonymous && this.hooksService?.prepareMergeSource && provider !== AuthProvider.ANONYMOUS) {
        mergeContext = await this.hooksService.prepareMergeSource(currentUser);
      }

      switch (provider) {
        case AuthProvider.ANONYMOUS:
          if (currentUser) {
            throw new Error('Cannot signIn anonymously whilst already signedIn, SignOut first');
          }
          if (await this.confirmTos(null, options)) {
            loading.present();
            userCred = await this.afa.signInAnonymously();
            await this.confirmTos(userCred, { skipTosCheck: true }); // Save tosAcceptance in firestore if sync enabled
            await loading.dismiss();
          }
          break;

        case AuthProvider.EmailAndPassword:
          if (currentUser && !currentUser.isAnonymous) {
            throw new Error('Cannot signIn whilst already signedIn, SignOut first');
          }
          if (!options?.credentials) {
            throw new Error('Credentials are required when signing in with AuthProvider.EmailAndPassword');
          }
          loading.present();
          userCred = await this.afa.signInWithEmailAndPassword(options.credentials.email, options.credentials.password);
          if (!await this.confirmTos(userCred, options)) {
            await this.signOut();
            userCred = null;
          };
          await loading.dismiss();
          break;

        case AuthProvider.PhoneNumber:
          // coming soon - see feature/sms branch
          break;

        default:
          loading.present();
          userCred = await this.socialAuth(provider, {
            ...options,
            permitNamedUserExec: false,
            permitAnonUserExec: true,
            permitNullUserExec: true,
            withCredentialFn: async (credential, currentUser) => await this.afa.signInWithCredential(credential),
            withProviderFn: async (fireProvider, currentUser) => await this.afa.signInWithPopup(fireProvider),
            onSuccessFn: async (userCred: UserCredential) => {
              if (!await this.confirmTos(userCred, options)) {
                await this.signOut();
                userCred = null;
              };
              return userCred;
            }
          });

      }

      // Will be null if user cancels operation
      if (userCred && userCred.user) {
        if (this.config.authUi.toastMessageOnAuthSuccess) {
          const successMessage = ('string' === typeof this.config.authUi.toastMessageOnAuthSuccess)
            ? this.config.authUi.toastMessageOnAuthSuccess
            : `Hello ${userCred.user.displayName ? userCred.user.displayName : ''}!`;
          this.ui.toast(successMessage, { duration: this.config.authUi.toastDefaultDurationMil });
        }

        // Run the merge hook if present and mergeContext has been generated by the prepare hook above.
        if (mergeContext && this.hooksService?.applyMergeToTarget) {
          try {
            await this.hooksService.applyMergeToTarget(userCred.user, mergeContext);
          } catch (error) {
            // If a failure occurs in merge applyToTarget we can't do much about it (we are already logged in as new user)
            // but we should at least log it. The onus is really on the applyToTarget function to handle it's own errors.
            this.fire.recordException(error);
          }
        }
        this.onSignInEmitter.emit(userCred.user);
      }

      await loading.dismiss();
      return userCred || null;

    } catch (error) {
      // code auth/user-not-found
      await this.handleError(error);
      await loading.dismiss();
      return null;
    }
  }

  /**
   * Reauthenicate the current user - a recent authentication is required for some sensitive operations
   * such as changing account details
   */
  public async reauthenicateWithProvider(provider: AuthProvider, options?: ISignInOptions): Promise<UserCredential | null> {

    this.fire.addLogMessage(`reauthenicateWithProvider; provider=${provider}`);
    const loading = await this.ui.createLoading();
    try {
      let userCred: UserCredential | null = null;

      // Throw error if reauthentication attempted whilst signed in as guest, nor not signed in.
      const currentUser = await this.afa.currentUser;
      if (!currentUser || currentUser.isAnonymous) {
        throw new Error('Caanot reauthticate if no currentUser or currentUser is anonymous');
      }

      loading.present();

      switch (provider) {
        case AuthProvider.ANONYMOUS:
          throw new Error('Cannot reauthenticate with anonymous Credentials');

        case AuthProvider.EmailAndPassword:
          if (!options?.credentials) {
            throw new Error('Credentials are required when reauthenticating with AuthProvider.EmailAndPassword');
          }
          if (!currentUser.email) {
            throw new Error('Cannot reauthenticate with email for an account without email');
          }
          if (!firebase.auth) {
            throw new Error('firebase.auth is undefined');
          }
          this.fire.addLogMessage(`creating email credential with firebase; email=${options.credentials.email}`);
          const authCred = firebase.auth.EmailAuthProvider.credential(currentUser.email, options.credentials.password);
          userCred = await currentUser.reauthenticateWithCredential(authCred);
          break;

        case AuthProvider.PhoneNumber:
          // coming soon - see feature/sms branch
          break;

        default:
          userCred = await this.socialAuth(provider, {
            ...options,
            permitNamedUserExec: true,
            permitNullUserExec: false,
            permitAnonUserExec: false,
            withCredentialFn: async (cred, currentUser) => await currentUser.reauthenticateWithCredential(cred),
            withProviderFn: async (fireProvider, currentUser) => await currentUser.reauthenticateWithPopup(fireProvider)
          });

      }

      await loading.dismiss();
      return userCred || null;

    } catch (error) {
      // code auth/user-not-found
      await this.handleError(error);
      await loading.dismiss();
      return null;
    }
  }

  /**
   * Link the current user to credentials from another auth provider.
   *
   * @param provider Provider to link.
   */
  public async linkCurrentUserToProvider(provider: AuthProvider, options?: ISignInOptions): Promise<UserCredential | null> {

    this.fire.addLogMessage(`Linking current anon user to provider; provider=${provider}`);
    const loading = await this.ui.createLoading();
    try {
      const currentUser = await this.afa.currentUser;
      if (null === currentUser) {
        throw new Error('CurrentUser is null');
      }

      await loading.present();
      let userCred: UserCredential | null = null;
      switch (provider) {
        case AuthProvider.ANONYMOUS:
          throw new Error('Linking a new anonymous user makes no sense');

        case AuthProvider.EmailAndPassword:
          if (!options?.credentials) {
            throw new Error('Credentials required to link to email credentential');
          }
          if (!firebase.auth) {
            throw new Error('firebase.auth is undefined');
          }
          this.fire.addLogMessage(`creating email credential with firebase; email=${options.credentials.email}`);
          const authCred = firebase.auth.EmailAuthProvider.credential(options.credentials.email, options.credentials.password);
          this.fire.addLogMessage(`linking userCredential to email authCredential`);
          userCred = await currentUser.linkWithCredential(authCred);
          break;

        case AuthProvider.PhoneNumber:
          throw new Error('Linking phone number not suported');

        default:
          userCred = await this.socialAuth(provider, {
            ...options,
            permitNamedUserExec: false,
            permitNullUserExec: false,
            permitAnonUserExec: true,
            withCredentialFn: async (cred, currentUser) => await currentUser.linkWithCredential(cred),
            withProviderFn: async (fireProvider, currentUser) => await currentUser.linkWithPopup(fireProvider)
          });
      }

      if (userCred && userCred.user) { // Null if user cancels (or perhaps fails) sign-in
        const userData = this.parseUserInfo(userCred.user);
        if (
          userData.displayName
          && (userCred.user.displayName !== userData.displayName || userCred.user.photoURL !== userData.displayName)
        ) {
          this.fire.addLogMessage(`Updating user profile; displayName=${userData.displayName}, photoUrl=${userData.photoURL}`);  // tslint:disable-line max-line-length
          await this.updateUserInfo({ displayName: userData.displayName, photoURL: userData.photoURL });
        }
      }

      await loading.dismiss();
      return userCred || null;

    } catch (error) {
      // Merge
      await this.handleError(error);
      await loading.dismiss();
      return null;

    }
  }

  /**
   * Creates a firebase user account authenticated with the specified provider.
   * If AuthProvider.EmailAndPassword is specified credentials and displayname must also be provided.
   */
  public async registerWith(provider: AuthProvider, options?: ISignInOptions): Promise<UserCredential | null> {

    this.fire.addLogMessage(`SigningUp with provider; provider=${provider}`);
    const loading = await this.ui.createLoading();
    try {

      // If the current user is anonymous - link the credentials to the existing user.
      // Otherwise if the user is logged in un-Anonymously, throw error
      const currentUser = await this.afa.currentUser;
      if (currentUser?.isAnonymous) { // Anonymous User
        return this.linkCurrentUserToProvider(provider, options);
      } else if (null !== currentUser) { // Non-Anonymous User
        throw new Error('Cannot Register whilst signed in as a non-Anonymous user. SignOut first');
      } else if (!await this.confirmTos(null, options)) { // No current user
        this.fire.addLogMessage('User declined TOS during register');
        return null;
      }

      let userCred: UserCredential | null = null;
      switch (provider) {

        case AuthProvider.EmailAndPassword:
          if (!options?.credentials || !options?.displayName) {
            throw new Error('Credentials & displayName required to SignUp by email');
          }
          await loading.present();
          this.fire.addLogMessage(`creaating user with email and password; email=${options.credentials.email}`);
          userCred = await this.afa.createUserWithEmailAndPassword(options.credentials.email, options.credentials.password);
          if (null === userCred.user) {
            throw new Error('User is null following successful signUp');
          }
          await this.updateUserInfo({ displayName: options.displayName });
          await this.confirmTos(userCred, { skipTosCheck: true }); // To save the tosAcceptance
          if (this.config.authUi.enableEmailVerification) {
            await userCred.user.sendEmailVerification();
          }
          break;

        default:
          await loading.present();
          userCred = await this.socialAuth(provider, {
            ...options,
            skipTosCheck: true,
            permitNamedUserExec: false,
            permitAnonUserExec: true,
            permitNullUserExec: true,
            withCredentialFn: async (credential, currentUser) => await this.afa.signInWithCredential(credential),
            withProviderFn: async (fireProvider, currentUser) => await this.afa.signInWithPopup(fireProvider)
          });
      }

      loading.dismiss();
      if (userCred?.user) {
        this.onRegisterEmitter.emit(userCred.user);
      }
      return userCred || null;
    } catch (error) {
      // This is where I would handle merge
      loading.dismiss();
      await this.handleError(error);
      return null;
    }

  }

  private async socialAuth(provider: AuthProvider, options: ISignInOptions & {
    permitNullUserExec: boolean,
    permitAnonUserExec: boolean,
    permitNamedUserExec: boolean,
    withCredentialFn: (credential: AuthCredential, currentUser: User | null) => Promise<UserCredential>,
    withProviderFn: (FirebaseAuthProvider: FirebaseAuthProvider, currentUser: User | null) => Promise<UserCredential>,
    onSuccessFn?: (userCred: UserCredential) => Promise<UserCredential>
  }): Promise<UserCredential | null> {
    const currentUser = await this.afa.currentUser;
    let userCred: UserCredential | null = null;

    const isNamedUser = !!currentUser && !currentUser.isAnonymous;
    const isAnonUser = !!currentUser && currentUser.isAnonymous;
    const isNullUser = !currentUser;

    if (false === options.permitNamedUserExec && isNamedUser) {
      throw new Error('Cannot perfom operation whilst signedIn, SignOut first');
    } else if (false === options.permitAnonUserExec && isAnonUser) {
      throw new Error('Cannot perfom operation whilst signedIn anonymously, SignOut first');
    } else if (false === options.permitNullUserExec && isNullUser) {
      throw new Error('Cannot perfom operation whilst not signed in.');
    }

    let credFactorySupportsProvider: boolean | undefined = undefined;
    if (!!this.credFactory) {
      credFactorySupportsProvider = await this.credFactory.isProviderSupported(provider);
    }
    console.log(credFactorySupportsProvider);
    if (credFactorySupportsProvider) {
      const factoryCred = await this.credFactory.getCredential(provider);
      if (factoryCred) {
        userCred = await options.withCredentialFn(factoryCred, currentUser);
      }
    } else if (false !== credFactorySupportsProvider && this.isWebPlatform) {
      userCred = await options.withProviderFn(this.getAuthProvider(provider), currentUser);
      /*
      a: null
    code: "auth/popup-closed-by-user"
    message: "The popup has been closed by the user before finalizing the operation."
    __proto__: Error
    */
    } else {
      throw new Error('Cannot perfom operation on current device.');
    }
    if (userCred && !!options.onSuccessFn) {
      userCred = await options.onSuccessFn(userCred)
    }
    return userCred;
  }

  /**
   * Present dialog and confirm the user agress to the privacy policy and terms of service (if either configured).
   * If nether configured returns true;
   *
   * @returns True if either user agrees to TOS/PrivacyUrl || no TOS/PrivacyUrl configured.
   */
  private async confirmTos(userCred: UserCredential | null = null, options: { skipTosCheck?: boolean } = {}): Promise<boolean> {
    if (this.config.authUi.tosUrl || this.config.authUi.privacyPolicyUrl) {
      let acceptedTos: string | null = (options.skipTosCheck) ? new Date().toISOString() : null;

      if (!acceptedTos && userCred?.user && !userCred?.additionalUserInfo?.isNewUser && this.config.authUi.enableFirestoreSync) {
        const userData = await this.fireStoreService.getUserData(userCred.user.uid);
        acceptedTos = userData?.acceptedTos || null;
      }

      if (!acceptedTos && await this.ui.confirmTos()) {
        acceptedTos = new Date().toISOString();
      }

      if (userCred?.user && this.config.authUi.enableFirestoreSync) {
        await this.fireStoreService.setUserData(userCred.user.uid, { acceptedTos }, { merge: true });
      }

      return !!acceptedTos;

    } else { // No tosUrl || privacyPolicyUrl
      return true;
    }
  }

  /**
   * Send the currently authenticated user another verficiation email.
   */
  async sendNewVerificationEmail(): Promise<void> {
    try {
      const currentUser = await this.afa.currentUser;
      if (!currentUser) {
        throw new Error('No signed in user');
      }
      await currentUser.sendEmailVerification();
    } catch (error) {
      this.fire.recordException(error);
      throw error;
    }
  }

  /**
   * SignOut the currently authenticated user.
   */
  async signOut() {
    try {
      await this.afa.signOut();
      if (this.credFactory) {
        this.credFactory.signOut();
      }
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * Update the details for the authenticated user of  in the firebase authentication and sync with firestore.
   *
   * @param userInfo - UserInfo object containing those properties for which change is requried. Only provider
   *                   the properties actually to be changed. Others should be ommitted.
   */
  public async updateUserInfo(userInfo: Partial<UserInfo>): Promise<void> {
    try {
      const user: User | null = await this.afa.currentUser;
      if (!user) {
        throw new Error('No currentUser');
      }

      if (userInfo.email) {
        await user.updateEmail(userInfo.email);
      }

      if (userInfo.phoneNumber) {
        await user.updatePhoneNumber(userInfo.phoneNumber as any); // TODO - bet this doesn't actually work
      }

      if (userInfo.displayName || userInfo.photoURL) {
        await user.updateProfile({
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL
        });
      }
      await this.afa.updateCurrentUser(user);

      if (this.config.authUi.enableFirestoreSync) {
        // await this.fireStoreService.updateUserData(user.uid, this.parseUserInfo(user));
        await this.fireStoreService.updateUserData(user.uid, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
      }

      this.onUserUpdatedEmitter.emit();

    } catch (error) {
      this.fire.recordException(error);
    }
  }

  /**
   * Extract UserInfo object from the User object
   * If multiple providers are supplied these are amalgamated to create the most complete
   * UserInfo object possible
   */
  public parseUserInfo(user: User): UserInfo {
    const userInfo: UserInfo = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerId: user.providerId
    };
    if (user.providerData) {
      user.providerData.forEach(item => {
        if (!userInfo.displayName && item?.displayName) { userInfo.displayName = item.displayName; }
        if (!userInfo.email && item?.email) { userInfo.email = item.email; }
        if (!userInfo.phoneNumber && item?.phoneNumber) { userInfo.phoneNumber = item.phoneNumber; }
        if (!userInfo.photoURL && item?.photoURL) { userInfo.photoURL = item.photoURL; }
        if (!userInfo.providerId && item?.providerId) { userInfo.providerId = item.providerId; }
      });
    }
    return userInfo;
  }

  /**
   * Returns the UserPhotoUrl, or an appropraite placeholder if not provided
   * ToDo - this would probably bet better inside a user-photo component
   */
  public getUserPhotoUrl(): Observable<string | null> {
    return this.user$.pipe(
      map((user: User | null) => {
        if (!user) {
          return null;
        } else if (user.photoURL) {
          return user.photoURL;
        } else if (user.emailVerified) {
          return `assets/user/${Accounts.CHECK}.svg`;
        } else if (user.isAnonymous) {
          return `assets/user/${Accounts.OFF}.svg`;
        } else {
          return `assets/user/${Accounts.NONE}.svg`;
        }
      })
    );
  }

  /**
   *  Refresh user info. Can be useful for instance to get latest status regarding email verification.
   */
  async reloadUserInfo() {
    const user = await this.user$.pipe(take(1)).toPromise();
    if (user) {
      await user.reload();
    }
  }

  /**
   * Deletes the current user
   */
  async deleteUser() {
    const currentUser = await this.afa.currentUser;
    const currentUid = currentUser?.uid;
    if (!currentUser || !currentUid) {
      throw new Error('Unable to delete currentUser if null');
    }
    const canDelete = (this.hooksService?.beforeDelete) ? await this.hooksService.beforeDelete(currentUser) : true;
    // Allow exception from beforeDelete to propgate
    if (canDelete) {
      try {
        // Userdata deleted by DB trigger
        await currentUser.delete();
        this.onUserDeletedEmitter.emit();
      } catch (error) {
        if (error.code !== FirebaseErrorCodes.requiresRecentLogin) {
          this.fire.recordException(error);
        }
        throw (error);
      }
    }
  }

  /**
   * Logs the error and provides user error notifcation if appropriate
   */
  async handleError(error: any) {
    await this.fire.recordException(error);
    this.onErrorEmitter.emit(error);
    if (this.config.authUi.toastMessageOnAuthError) {
      let message: string = 'auth.common.pleaseRetry';
      if (error && typeof error === 'string') {
        message = error;
      } else if (error && error.message) {
        message = error.message;
      } else if (error && typeof error === 'object') {
        message = JSON.stringify(error);
      } else if (error) {
        message = error.toString();
      }
      await this.ui.toast(message, { duration: this.config.authUi.toastDefaultDurationMil });
    }
  }

  /**
   * Returns a firebase auth provider object for the specified provider
   */
  private getAuthProvider(provider: AuthProvider): FirebaseAuthProvider {
    if (!firebase.auth) {
      throw new Error('firebase.auth is undefined');
    }
    switch (provider) {
      case AuthProvider.Google: return new firebase.auth.GoogleAuthProvider();
      case AuthProvider.Apple: return new firebase.auth.OAuthProvider('apple.com');
      case AuthProvider.Facebook: return new firebase.auth.FacebookAuthProvider();
      case AuthProvider.Twitter: return new firebase.auth.TwitterAuthProvider();
      case AuthProvider.Github: return new firebase.auth.GithubAuthProvider();
      case AuthProvider.Microsoft: return new firebase.auth.OAuthProvider('microsoft.com');
      case AuthProvider.Yahoo: return new firebase.auth.OAuthProvider('yahoo.com');
      default: throw new Error(`${provider} is not available as auth provider`);
    }
  }

}
