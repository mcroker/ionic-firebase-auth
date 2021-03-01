import { Injectable, Optional } from '@angular/core';
import { AngularFirePerformance } from '@angular/fire/performance';
import { IPerformanceTrace, IPerformanceProvider } from '../interfaces';

export class PerformanceTraceNoop implements IPerformanceTrace {
    start() { }
    stop() { }
    putAttribute(key: string, value: any) { }
}

@Injectable({ providedIn: 'root' })
export class PerformanceService implements IPerformanceProvider {

    dataCollectionEnabled = Promise.resolve(false);

    createTrace(label: string): Promise<IPerformanceTrace> {
        return Promise.resolve(new PerformanceTraceNoop());
    }

    constructor(
        @Optional() performanceProvider: AngularFirePerformance
    ) {
        if (performanceProvider) {
            this.createTrace = performanceProvider.trace;
        }
    }

}
