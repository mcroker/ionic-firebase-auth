import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

declare type CallableFn = (x: any) => Observable<any>;

export function fakeResponse(response: any = {}): CallableFn {
    return (x: any) => new Observable<any>(sub => {
        sub.next(response);
        sub.complete();
    });
}

export class FakeAngularFireFunctions {

    httpsCallable: jasmine.Spy<(x: string) => CallableFn> = jasmine.createSpy<(x: string) => CallableFn>('httpsCallable');

    constructor() {
        this.httpsCallable.and.returnValue(fakeResponse());
    }

    static create(): AngularFireFunctions & FakeAngularFireFunctions {
        return new FakeAngularFireFunctions() as any as FakeAngularFireFunctions & AngularFireFunctions;
    }

}
