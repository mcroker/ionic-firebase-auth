import { ILoadingUIProvider } from 'ngx-firebase';
import { Observable } from 'rxjs';

export class FakeLoadingService {

    create: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('create');

    present: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('present');
    dismiss: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('dismiss');

    watchObservable: jasmine.Spy<(source: Observable<boolean>) => void>
        = jasmine.createSpy<(source: Observable<boolean>) => void>('watchObservable');

    isVisible: boolean = false;

    constructor() {
        this.present.and.callFake(async () => this.isVisible = true);
        this.dismiss.and.callFake(async () => this.isVisible = false);
        this.create.and.resolveTo({
            present: this.present,
            dismiss: this.dismiss
        });
    }

    static create(): ILoadingUIProvider & FakeLoadingService {
        return new FakeLoadingService() as ILoadingUIProvider & FakeLoadingService;
    }

}
