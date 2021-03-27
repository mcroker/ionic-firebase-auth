// Angular
import { EventEmitter, forwardRef, Inject, Injectable, Optional } from '@angular/core';

// RXJS
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';

// Firebase & AngularFire
import { firebase } from '@firebase/app';
import 'firebase/auth';
import { User, UserInfo, UserCredential, AuthProvider as FirebaseAuthProvider } from '@firebase/auth-types';
import { AngularFireAuth } from '@angular/fire/auth';

// Mal
import { FirestoreSyncService } from './firestore-sync.service';
import {
  MalCredentialFactoryProviderToken,
  MalMergeUserServiceToken, MalSharedConfigToken,
  MalSharedConfig, AuthProvider, ISignInOptions, Accounts, IAuthMergeUserService,
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

  private readonly tokenRefreshed$: Subject<void> = new Subject<void>();

  // Legacy field that is set to true after sign up.
  // Value is lost in case of reload. The idea here is to know if we just sent a verification email.
  emailConfirmationSent?: boolean;
  // Legacy fieled that contain the mail to confirm. Same lifecycle than emailConfirmationSent.
  emailToConfirm?: string;

  constructor(
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    @Optional() @Inject(forwardRef(() => MalMergeUserServiceToken)) public mergeService: IAuthMergeUserService,
    @Optional() @Inject(forwardRef(() => MalCredentialFactoryProviderToken)) public credFactory: ICredentialFactoryProvider,
    private fireStoreService: FirestoreSyncService,
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
   */
  async isProviderSupported(provider: AuthProvider): Promise<boolean> {
    return (this.config.authUi.supportedProviders === AuthProvider.ALL || this.config.authUi.supportedProviders.includes(provider))
      && (this.isWebPlatform || (this.credFactory && await this.credFactory.isProviderSupported(provider)));
  }

  public async refreshToken(): Promise<void> {
    const user = await this.afa.currentUser;
    if (user) {
      await user.getIdToken(true);
      await this.tokenRefreshed$.next();
    }
  }

  public selectCurrentUserClaim<T>(claim: string): Observable<T | null | undefined> {
    return new Observable<T | null | undefined>(subscriber => {
      const handleTokenRefresh = async (user: User | null) => {
        if (user) {
          const token = await user.getIdTokenResult();
          subscriber.next(token.claims[claim]);
        } else {
          subscriber.next(null);
        }
      };
      this.tokenRefreshed$.subscribe(async () => {
        const user = await this.afa.currentUser;
        await handleTokenRefresh(user);
      });
      this.afa.user.subscribe(async user => {
        await handleTokenRefresh(user);
      });
    });
  }

  public getCurrentUserClaim<T>(claim: string): Promise<T | null | undefined> {
    return this.selectCurrentUserClaim<T>(claim).pipe(take(1)).toPromise();
  }

  /**
   * Reset the password of currently authenticated user via email
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
  public async signInWith(provider: AuthProvider, options?: ISignInOptions)
    : Promise<UserCredential | null> {

    this.fire.addLogMessage(`SignInWithProvider; provider=${provider}`);
    const loading = await this.ui.createLoading();
    try {
      let userCred: UserCredential | null = null;

      const currentUser = await this.afa.currentUser;

      // Only merge an anonymous user >>> non-anonymous user
      // Don't catch any errors, so they are caught by function and trigger a login abort.
      let mergeContext: any = null;
      if (currentUser && currentUser.isAnonymous && this.mergeService && provider !== AuthProvider.ANONYMOUS) {
        mergeContext = await this.mergeService.prepareSource(currentUser);
      }

      switch (provider) {
        case AuthProvider.ANONYMOUS:
          if (currentUser) {
            throw new Error('Cannot signIn anonymously whilst already signedIn, SignOut first');
          }
          if (await this.confirmTos(null, options)) {
            loading.present();
            userCred = await this.afa.signInAnonymously();
            await loading.dismiss();
            await this.confirmTos(userCred, { skipTosCheck: true }); // Save tosAcceptance in firestore
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
          await loading.dismiss();
          if (!await this.confirmTos(userCred, options)) {
            await this.signOut();
            userCred = null;
          };
          break;

        case AuthProvider.PhoneNumber:
          // coming soon - see feature/sms branch
          break;

        default:
          if (currentUser && !currentUser.isAnonymous) {
            throw new Error('Cannot signIn whilst already signedIn, SignOut first');
          }
          if (this.credFactory && await this.credFactory.isProviderSupported(provider)) {
            loading.present();
            const factoryCred = await this.credFactory.getCredential(provider);
            if (factoryCred) {
              userCred = await this.afa.signInWithCredential(factoryCred);
            }
            await loading.dismiss();
          } else if (this.isWebPlatform) {
            loading.present();
            userCred = await this.afa.signInWithPopup(this.getAuthProvider(provider));
            await loading.dismiss();
          } else {
            throw new Error('A CredentialFactory is required to use AuthProcessService on a non-web platform');
          }
          await loading.dismiss();
          if (!await this.confirmTos(userCred, options)) {
            await this.signOut();
            userCred = null;
          };
          break;
      }

      // Will be null if user cancels operation
      if (userCred) {
        await this.handleSignInSuccess(userCred);
        if (userCred.user && mergeContext && this.mergeService) {
          try {
            await this.mergeService.applyToTarget(userCred.user, mergeContext);
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
   */
  public async reauthenicateWithProvider(provider: AuthProvider, options?: ISignInOptions)
    : Promise<UserCredential | null> {

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
            throw new Error('Credentials are required when signing in with AuthProvider.EmailAndPassword');
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
          if (this.credFactory && await this.credFactory.isProviderSupported(provider)) {
            const factoryCred = await this.credFactory.getCredential(provider);
            if (factoryCred) {
              userCred = await currentUser.reauthenticateWithCredential(factoryCred);
            }
          } else if (this.isWebPlatform) {
            userCred = await currentUser.reauthenticateWithPopup(this.getAuthProvider(provider));
          } else {
            throw new Error('A CredentialFactory is required to use AuthProcessService on a non-web platform');
          }
          break;
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
          throw new Error('Linking anonymous user makes no sense');

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
          if (this.credFactory && await this.credFactory.isProviderSupported(provider)) {
            const factoryCred = await this.credFactory.getCredential(provider);
            if (factoryCred) {
              userCred = await currentUser.linkWithCredential(factoryCred);
            }
          } else if (this.isWebPlatform) {
            userCred = await currentUser.linkWithPopup(this.getAuthProvider(provider));
          } else {
            throw new Error('A CredentialFactory is required to use AuthProcessService on a non-web platform');
          }
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
        await this.handleSignInSuccess(userCred);
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
          // Legacy fields
          this.emailConfirmationSent = true;
          this.emailToConfirm = userCred.user.email || undefined;
          await this.handleSignInSuccess(userCred);
          await loading.dismiss();
          break;

        default:
          userCred = await this.signInWith(provider, { ...options, skipTosCheck: true });

      }

      if (userCred.user) {
        this.onRegisterEmitter.emit(userCred.user);
      }
      return userCred || null;
    } catch (error) {
      // This is where I would handle merge
      await this.handleError(error);
      await loading.dismiss();
      return null;
    }

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
   * Common handler for successful signIn
   * Refreshes FireStore User document based on current user (if enabled)
   * And provides welcome back toast (if enabled)
   *
   * @param cred UserCredential object provided by signIn function
   */
  async handleSignInSuccess(cred: UserCredential) {
    if (null === cred.user) {
      throw new Error('user is null whilst handling sucessful login');
    }
    // if (this.config.authUi.enableFirestoreSync) {
    // Now done by server-side trigger await this.fireStoreService.createUserData(userData);
    // try {
    //   const userData = this.parseUserInfo(cred.user);
    //   this.fire.addLogMessage(`About to create user data in firestore; user=${JSON.stringify(userData)}`);
    // } catch (error) {
    //   this.fire.recordException(error);
    // }
    // }
    if (this.config.authUi.toastMessageOnAuthSuccess) {
      const successMessage = ('string' === typeof this.config.authUi.toastMessageOnAuthSuccess)
        ? this.config.authUi.toastMessageOnAuthSuccess
        : `Hello ${cred.user.displayName ? cred.user.displayName : ''}!`;
      this.ui.toast(successMessage, { duration: this.config.authUi.toastDefaultDurationMil });
    }
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
