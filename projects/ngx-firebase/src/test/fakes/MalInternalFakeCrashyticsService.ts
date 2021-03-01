import { CrashlyticsService } from '../../shared/services';

export class MalInternalFakeCrashlyticsService {

    recordException: jasmine.Spy<(e: any) => Promise<void>> = jasmine.createSpy('recordException');
    addLogMessage: jasmine.Spy<(message: string) => Promise<void>> = jasmine.createSpy('addLogMessage');
    setUserId: jasmine.Spy<(uid: string | null) => void> = jasmine.createSpy('setUserId');

    static create(): MalInternalFakeCrashlyticsService & CrashlyticsService {
        return new MalInternalFakeCrashlyticsService() as any as MalInternalFakeCrashlyticsService & CrashlyticsService;
    }

    constructor() {
        this.recordException.and.resolveTo();
        this.addLogMessage.and.resolveTo();
    }

}