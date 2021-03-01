import { IToastUIProvider } from '../../shared/interfaces';

export class MalInternalFakeToastService {

    create = jasmine.createSpy<(message: string, duration?: number) => Promise<any>>('create');
    open = jasmine.createSpy<(message: string, duration?: number) => Promise<any>>('open');

    static create(): MalInternalFakeToastService & IToastUIProvider {
        return new MalInternalFakeToastService() as any as MalInternalFakeToastService & IToastUIProvider;
    }

}
