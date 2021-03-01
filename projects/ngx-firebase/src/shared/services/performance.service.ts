import { Injectable, Optional } from '@angular/core';
import { AngularFirePerformance } from '@angular/fire/performance';
import { IPerformanceTrace } from '../interfaces';

export class PerformanceTraceNoop implements IPerformanceTrace {
    start() { }
    stop() { }
    putAttribute(key: string, value: any) { }
}

@Injectable({ providedIn: 'root' })
export class PerformanceService {

    dataCollectionEnabled = Promise.resolve(false);

    trace(label: string): Promise<IPerformanceTrace> {
        return Promise.resolve(new PerformanceTraceNoop());
    }

    constructor(
        @Optional() performanceProvider: AngularFirePerformance
    ) {
        if (performanceProvider) {
            this.trace = performanceProvider.trace;
        }
    }

}
