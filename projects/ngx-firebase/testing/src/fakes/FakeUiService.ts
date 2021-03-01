import {
    UiService, ITextAlertOptions, IYesNoAlertOptions, IOkAlertOptions,
    IToastElem, IToastOptions, ILoadingElem, IUIProvider
} from 'ngx-firebase';
import { Observable, Subscription } from 'rxjs';

export class FakeUiService implements jasmine.SpyObj<IUIProvider> {

    logError = jasmine.createSpy<(error: Error, message?: string | null) => void>('logError');

    toast = jasmine.createSpy<(message: string, options?: IToastOptions) => Promise<void>>('toast');
    createToast = jasmine.createSpy<(message: string, options?: IToastOptions) => Promise<IToastElem>>('createToast');
    errorToast = jasmine.createSpy<(error: Error, messagePrefix?: string, options?: IToastOptions) => Promise<void>>('errorToast');

    yesNoAlert = jasmine.createSpy<(message: string, options?: IYesNoAlertOptions) => Promise<boolean>>('yesNoAlert');
    okAlert = jasmine.createSpy<(message: string, options?: IOkAlertOptions) => Promise<void>>('okAlert');
    errorAlert = jasmine.createSpy<(message: string, options?: IOkAlertOptions) => Promise<void>>('errorAlert');
    infoAlert = jasmine.createSpy<(message: string, options?: IOkAlertOptions) => Promise<void>>('infoAlert');
    textboxInputAlert = jasmine.createSpy<(opts: ITextAlertOptions) => Promise<string | null>>('textboxInputAlert');

    createLoading = jasmine.createSpy<(message?: string) => Promise<ILoadingElem>>('createLoading');
    watchLoading = jasmine.createSpy<(
        source: Observable<boolean>,
        options?: { debounce?: number, message?: string, timeoutMs?: number | null, debug?: string }
    ) => Promise<Subscription>>('watchObservable');
    isLoadingVisible: boolean = false;

    confirmTos = jasmine.createSpy<() => Promise<boolean | null>>('confirmTos');

    static create(): FakeUiService & UiService {
        return new FakeUiService() as any as FakeUiService & UiService;
    }

    constructor(
    ) {
        this.createLoading.and.resolveTo({
            present: async () => { this.isLoadingVisible = true },
            dismiss: async () => { this.isLoadingVisible = false }
        });
    }

}
