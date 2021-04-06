import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Inject, Injector, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, NG_VALIDATORS, Validator } from '@angular/forms';
import { AuthSharedConfigToken, AuthSharedConfig, ValueAccessorControlComponent } from 'ionic-firebase-auth';

@Component({
    selector: 'auth-authui-name-field',
    templateUrl: 'name-field.component.html',
    styleUrls: ['../../ionic-auth-ui.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AuthUINameFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: AuthUINameFieldComponent, multi: true }]
})
export class AuthUINameFieldComponent extends ValueAccessorControlComponent<string>
    implements ControlValueAccessor, Validator, OnDestroy, AfterViewInit {

    public control: FormControl = new FormControl('', [
        Validators.minLength(this.config.authUi.nameMinLength),
        Validators.maxLength(this.config.authUi.nameMaxLength)
    ]);

    constructor(
        @Inject(forwardRef(() => AuthSharedConfigToken)) public config: AuthSharedConfig,
        injector: Injector,
        cdRef: ChangeDetectorRef
    ) {
        super(injector, cdRef);
    }

}
