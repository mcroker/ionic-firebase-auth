export interface ICredentials {
  email: string;
  password: string;
}

export interface ISignInOptions {
  displayName?: string;
  credentials?: ICredentials;
  skipTosCheck?: boolean;
}

// tslint:disable-next-line max-len
export const PHONE_NUMBER_REGEX = new RegExp(['^[+]{0,1}[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\.]{0,1}[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]{4,12}$'].join(''));

export enum FirebaseErrorCodes {
  requiresRecentLogin = 'auth/requires-recent-login'
}
