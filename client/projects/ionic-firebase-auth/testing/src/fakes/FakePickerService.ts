import { IPickerUIProvider, IPickerServiceOptions } from 'ionic-firebase-auth';

export class FakePickerService {

    picker: jasmine.Spy<(opts: IPickerServiceOptions) => Promise<any>> = jasmine.createSpy('picker');

    static create(): FakePickerService & IPickerUIProvider {
        return new FakePickerService() as any as FakePickerService & IPickerUIProvider;
    }

}
