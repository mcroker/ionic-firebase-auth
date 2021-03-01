import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { AuthProcessService } from 'ngx-firebase';
import { User } from '@firebase/auth-types';
import { EventEmitter } from '@angular/core';

export class FakeAuthProcessService {

    readonly _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    readonly user$: Observable<User | null> = this._user$.asObservable();

    readonly _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable();

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
