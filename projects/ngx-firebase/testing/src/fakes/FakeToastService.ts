import { IToastUIProvider } from 'ngx-firebase';

export class FakeToastService {

    create = jasmine.createSpy<(message: string, duration?: number) => Promise<any>>('create');
    open = jasmine.createSpy<(message: string, duration?: number) => Promise<any>>('open');
    openError = jasmine.createSpy<(message: string, error: Error) => Promise<any>>('openError');

    static create(): FakeToastService & IToastUIProvider {
        return new FakeToastService() as any as FakeToastService & IToastUIProvider;
    }

}
