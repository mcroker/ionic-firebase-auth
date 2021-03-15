import { TranslateLoader } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

type GetFn = (key: string | Array<string>, interpolateParams?: Object) => Observable<string | any>;  // tslint:disable-line ban-types

export class FakeTranslateService implements TranslateLoader {

    get = jasmine.createSpy<GetFn>('get');

    static create(): FakeTranslateService & TranslateService {
        return new FakeTranslateService() as any as FakeTranslateService & TranslateService;
    }

    constructor() {
        this.get.and.callFake(this.getTranslation);
    }

    getTranslation(x: string): Observable<string>;
    getTranslation(x: string[]): Observable<{ [key: string]: string }>;
    getTranslation(x: string | string[]): Observable<string> | Observable<{ [key: string]: string }> {
        if ('string' === typeof x) {
            return of(x);
        } else {
            const obj = {};
            x.forEach(item => obj[item] = item);
            return of(obj);
        }
    }

}
