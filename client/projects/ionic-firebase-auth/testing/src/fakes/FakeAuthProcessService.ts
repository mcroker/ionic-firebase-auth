import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { AuthProcessService } from 'ionic-firebase-auth';
import { User } from '@firebase/auth-types';
import { EventEmitter } from '@angular/core';

export class FakeAuthProcessService {

    readonly _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    readonly user$: Observable<User | null> = this._user$.asObservable();
    get user(): User | null { return this._user$.value };

    readonly _canRegister$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    readonly canRegister$: Observable<boolean> = this._canRegister$.asObservable();

    readonly _canSignIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    readonly canSignIn$: Observable<boolean> = this._canSignIn$.asObservable();

    readonly _canSignOut$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly canSignOut$: Observable<boolean> = this._canSignOut$.asObservable();

    readonly _canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly canEdit$: Observable<boolean> = this._canEdit$.asObservable();

    readonly _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable();

    readonly _isAnonymous$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isAnonymous$: Observable<boolean> = this._isAnonymous$.asObservable();

    readonly _onSignOut$: Subject<void> = new Subject<void>();
    onSignOut$: Observable<void> = this._onSignOut$.asObservable();

    readonly showProfileDialog: EventEmitter<void> = new EventEmitter<void>();

    selectCurrentUserClaim: jasmine.Spy<(claim: string) => Observable<any>> = jasmine.createSpy<(claim: string) => Observable<any>>('selectCurrentUserClaim');

    constructor() {
        this.selectCurrentUserClaim.and.returnValue(of(false));
    }

    static create(): FakeAuthProcessService & AuthProcessService {
        return new FakeAuthProcessService() as any as FakeAuthProcessService & AuthProcessService;
    }

}
