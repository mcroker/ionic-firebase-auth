import { CrashlyticsService } from '../../shared/services';

export class AuthInternalFakeCrashlyticsService {

    recordException: jasmine.Spy<(e: any) => Promise<void>> = jasmine.createSpy('recordException');
    addLogMessage: jasmine.Spy<(message: string) => Promise<void>> = jasmine.createSpy('addLogMessage');
    setUserId: jasmine.Spy<(uid: string | null) => void> = jasmine.createSpy('setUserId');

    static create(): AuthInternalFakeCrashlyticsService & CrashlyticsService {
        return new AuthInternalFakeCrashlyticsService() as any as AuthInternalFakeCrashlyticsService & CrashlyticsService;
    }

    constructor() {
        this.recordException.and.resolveTo();
        this.addLogMessage.and.resolveTo();
    }

}