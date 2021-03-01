import { CrashlyticsService } from 'ngx-firebase';

export class FakeCrashlyticsService {

    recordException: jasmine.Spy<(e: any) => Promise<void>> = jasmine.createSpy('recordException');
    addLogMessage: jasmine.Spy<(message: string) => Promise<void>> = jasmine.createSpy('addLogMessage');
    setUserId: jasmine.Spy<(uid: string | null) => void> = jasmine.createSpy('setUserId');

    static create(): FakeCrashlyticsService & CrashlyticsService {
        return new FakeCrashlyticsService() as any as FakeCrashlyticsService & CrashlyticsService;
    }

    constructor() {
        this.recordException.and.resolveTo();
        this.addLogMessage.and.resolveTo();
    }

}
