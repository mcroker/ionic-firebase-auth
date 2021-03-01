import { IAlertsUIProvider, ITextAlertOptions } from 'ngx-firebase';

export class FakeAlertsService {

    yesNoAlert = jasmine.createSpy<(message: string, subHeader?: string) => Promise<boolean>>('yesNoAlert');
    okAlert = jasmine.createSpy<(message: string, subHeader?: string) => Promise<void>>('okAlert');
    errorAlert = jasmine.createSpy<(message: string, subHeader?: string) => Promise<void>>('errorAlert');
    infoAlert = jasmine.createSpy<(message: string, subHeader?: string) => Promise<void>>('infoAlert');
    textboxInputAlert = jasmine.createSpy<(opts: ITextAlertOptions) => Promise<string | null>>('textboxInputAlert');

    static create(): FakeAlertsService & IAlertsUIProvider {
        return new FakeAlertsService() as any as FakeAlertsService & IAlertsUIProvider;
    }

}
