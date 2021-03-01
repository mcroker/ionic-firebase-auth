import { AnalyticsService } from 'ngx-firebase';

export class FakeAnalyticsService {

    setScreenName: jasmine.Spy<(name: string) => void> = jasmine.createSpy<(name: string) => void>('setScreenName');
    logEvent: jasmine.Spy<(name: string, params?: { [key: string]: any; }) => void>
        = jasmine.createSpy<(name: string, params?: { [key: string]: any; }) => void>('logEvent');
    setUserId: jasmine.Spy<(userId: string | null) => void> = jasmine.createSpy<(userId: string | null) => void>('setUserId');

    static create(): FakeAnalyticsService & AnalyticsService {
        return new FakeAnalyticsService() as any as FakeAnalyticsService & AnalyticsService;
    }

    constructor() {
    }

}
