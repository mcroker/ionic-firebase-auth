import { ILoadingUIProvider  } from '../../shared/interfaces';

export class MalInternalFakeLoadingService {

    create: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('create');

    present: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('present');
    dismiss: jasmine.Spy<() => Promise<any>> = jasmine.createSpy('dismiss');

    isVisible: boolean = false;

    constructor() {
        this.present.and.callFake(async () => this.isVisible = true);
        this.dismiss.and.callFake(async () => this.isVisible = false);
        this.create.and.resolveTo({
            present: this.present,
            dismiss: this.dismiss
        });
    }

    static create(): ILoadingUIProvider & MalInternalFakeLoadingService {
        return new MalInternalFakeLoadingService() as ILoadingUIProvider & MalInternalFakeLoadingService;
    }

}
