import { PerformanceService, IPerformanceTrace } from 'ngx-firebase';

export class PerformanceTraceNoop implements IPerformanceTrace {
    start() { }
    stop() { }
    putAttribute(key: string, value: any) { }
}

export class FakePerformanceService {

    dataCollectionEnabled = Promise.resolve(false);

    static create(): FakePerformanceService & PerformanceService {
        return new FakePerformanceService() as any as FakePerformanceService & PerformanceService;
    }

    trace(label: string): Promise<IPerformanceTrace> {
        return Promise.resolve(new PerformanceTraceNoop());
    }

    constructor() {
    }

}
