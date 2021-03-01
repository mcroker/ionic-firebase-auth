import { Observable } from 'rxjs';
import { AuthProvider } from './authprovider.enum';
import { ICredentials } from './main.interface';
import { UserInfo, User, AuthProvider as FirebaseAuthProvider, AuthCredential } from '@firebase/auth-types';

export type IFirebaseProvider = IAnalyticsProvider & ICrashlyticsProvider & IPerformanceProvider;

export interface IAnalyticsProvider {
    logEvent(name: string, params?: { [key: string]: any }): Promise<void>;
    setScreenName(screenName: string, screenClass?: string): Promise<void>;
    setUserId(userId: string | null): void;
}

export interface ICrashlyticsProvider {
    recordException(_options: iOSException | AndroidException): Promise<void>;
    addLogMessage(message: string): Promise<void>;
    setUserId(uid: string | null): void;
}

export interface IUserDatabaseProvider {
    getUserData(uid: string): Promise<UserInfo | null>;
    deleteUserData(uid: string): Promise<void>;
    updateUserData(uid: string, user: Partial<UserInfo>): Promise<void>;
}

export interface ICredentialFactoryProvider {
    isProviderSupported(provider: AuthProvider): Promise<boolean>;
    getCredential(provider: AuthProvider): Promise<AuthCredential>;
    signOut(): Promise<void>;
}

export interface IPerformanceProvider {
    createTrace(label: string): Promise<IPerformanceTrace>;
}

export interface IPerformanceTrace {
    start: () => void;
    stop: () => void;
    putAttribute: (key: string, value: any) => void;
}

export interface ContextOptions {
    key: string;
    value: string | number | boolean;
    type: 'string' | 'long' | 'double' | 'boolean' | 'int' | 'float';
}

export interface iOSException {  // tslint:disable-line class-name
    code?: number;
    domain?: string;
    message: string;
}

export interface AndroidException {
    message: string;
}

export interface IAuthProcessService {
    listenToUserEvents(): void;
    resetPassword(email: string): Promise<void>;
    signInWith(provider: AuthProvider, credentials?: ICredentials): Promise<void>;
    linkToProvider(provider: AuthProvider): Promise<void>;
    signInOrLinkWithProvider(provider: AuthProvider): Promise<void>;
    signUp(displayName: string, credentials: ICredentials): Promise<void>;
    sendNewVerificationEmail(): Promise<void | never>;
    signOut(): Promise<void>;
    updateProfile(displayName: string, photoURL: string | null): Promise<void>;
    getUserPhotoUrl(): Observable<string | null>;
    getPhotoPath(image: string): string;
    signInWithPhoneNumber(): Promise<void>;
    reloadUserInfo(): Promise<void>;
    getAuthProvider(provider: AuthProvider): FirebaseAuthProvider;
}

export interface IAuthMergeUserService {
    prepareSource(sourceUser: User): Promise<any>;
    applyToTarget(targetUser: User, context: any): Promise<void>;
}
