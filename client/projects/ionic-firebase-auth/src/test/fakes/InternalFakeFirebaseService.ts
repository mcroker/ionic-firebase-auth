import { FirebaseService} from '../../shared/services';
import { IFirebaseProvider, IPerformanceTrace } from '../../shared/interfaces';

export class PerformanceTraceNoop implements IPerformanceTrace {
    start() { }
    stop() { }
    putAttribute(key: string, value: any) { }
}

export class  AuthInternalFakeFirebaseService implements jasmine.SpyObj<IFirebaseProvider> {

    dataCollectionEnabled = Promise.resolve(false);

    recordException: jasmine.Spy<(e: any) => Promise<void>> = jasmine.createSpy('recordException');
    addLogMessage: jasmine.Spy<(message: string) => Promise<void>> = jasmine.createSpy('addLogMessage');

    setUserId: jasmine.Spy<(uid: string | null) => void> = jasmine.createSpy('setUserId');

    setScreenName = jasmine.createSpy<(name: string) => Promise<void>>('setScreenName');
    logEvent = jasmine.createSpy<(name: string, params?: { [key: string]: any; }) => Promise<void>>('logEvent');

    createTrace = jasmine.createSpy<(label: string) => Promise<IPerformanceTrace>>('createTrace');

    static create():  AuthInternalFakeFirebaseService & FirebaseService {
        return new  AuthInternalFakeFirebaseService() as any as  AuthInternalFakeFirebaseService & FirebaseService;
    }

    constructor(
    ) {
        this.createTrace.and.resolveTo(new PerformanceTraceNoop());
    }

}
