import { Observable, Subscription } from "rxjs";

export type IUIProvider = ILoadingUIProvider & IAlertsUIProvider & IToastUIProvider & IPickerUIProvider;

// LOADING

export interface ILoadingUIProvider {
    create(message?: string): Promise<ILoadingElem>;
    watchObservable(
        source: Observable<boolean>,
        options?: { debounce?: number, message?: string, timeoutMs?: number | null, debug?: string }
    ): Promise<Subscription>;
}

export interface ILoadingElem {
    present(): Promise<void>;
    dismiss(): Promise<any>;
}

// ALERTS

export interface IAlertsUIProvider {
    yesNoAlert(message: string, options?: IYesNoAlertOptions): Promise<boolean>;
    okAlert(message: string, options?: IOkAlertOptions): Promise<void>;
    errorAlert(message: string, options?: IOkAlertOptions): Promise<void>;
    infoAlert(message: string, options?: IOkAlertOptions): Promise<void>;
    textboxInputAlert(options: ITextAlertOptions): Promise<string | null>;
}

export interface ITextAlertOptions extends IOkAlertOptions {
    okText?: string;
    value?: string;
    placeholder?: string;
}

export interface IYesNoAlertOptions extends IOkAlertOptions {
    defaultToNo?: boolean;
}

export interface IOkAlertOptions {
    header?: string;
    subHeader?: string;
    interpolateParams?: object;
}

// PICKER

export interface IPickerUIProvider {
}

export interface IPickerServiceOptions {
    title: string;
    options: { text: string, value: any }[];
    confirmText?: string;
    cancelText?: string;
    interpolateParams?: object;
}

// TOAST

export interface IToastUIProvider {
    create(message: string, options?: IToastOptions): Promise<IToastElem>;
    open(message: string, options?: IToastOptions): Promise<void>;
    openError(error: Error, messagePrefix?: string, options?: IToastOptions): Promise<void>;
}

export interface IToastElem {
    present(): Promise<void>;
    dismiss(): Promise<any>;
    onDidDismiss(): Promise<any>;
}

export interface IToastOptions {
    duration?: number;
    interpolateParams?: object;
    position?: 'middle' | 'top' | 'bottom';
}

// LEGALITY DIALOG SERVICE

export interface ILegalityDialogUIProvider {
    confirmTos(): Promise<boolean | null>;
}
