import { AngularFirePerformance } from '@angular/fire/performance';

export class FakeAngularFirePerformance {

    trace: jasmine.Spy<(name: string) => Promise<any>> = jasmine.createSpy('trace');

    start: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('start');
    stop: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('stop');
    putAttribute: jasmine.Spy<(key: string, value: any) => Promise<any>> = jasmine.createSpy('putAttribute');

    constructor() {
        this.trace.and.resolveTo({
            start: this.start,
            stop: this.stop,
            putAttribute: this.putAttribute
        });
    }

    static create(): FakeAngularFirePerformance & AngularFirePerformance {
        return new FakeAngularFirePerformance() as any as FakeAngularFirePerformance & AngularFirePerformance;
    }

}
