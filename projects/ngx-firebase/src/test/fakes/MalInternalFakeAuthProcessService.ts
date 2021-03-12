import { BehaviorSubject, Observable } from 'rxjs';
import { AuthProcessService } from '../../shared/services';
import { User } from '@firebase/auth-types';

export class MalInternalFakeAuthProcessService {

    get user$(): Observable<User | null> { return this._user$.asObservable(); }
    // get currentUser(): Promise<User | null> { return Promise.resolve(this._user$.value); }
    readonly _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    static create(): MalInternalFakeAuthProcessService & AuthProcessService {
        return new MalInternalFakeAuthProcessService() as any as MalInternalFakeAuthProcessService & AuthProcessService;
    }

}
