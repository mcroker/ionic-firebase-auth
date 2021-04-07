import { ChangeDetectorRef, Component, forwardRef, Injector } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, Validators, NG_VALIDATORS } from '@angular/forms';
import { ValueAccessorControlComponent } from 'ionic-firebase-auth';

@Component({
    selector: 'auth-email-field',
    templateUrl: 'email-field.component.html',
    styleUrls: ['../../ionic-auth-ui.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AuthUIEmailFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: AuthUIEmailFieldComponent, multi: true }]
})
export class AuthUIEmailFieldComponent extends ValueAccessorControlComponent<string> {

    public control: FormControl = new FormControl('', [Validators.email]);

    constructor(
        injector: Injector,
        cdRef: ChangeDetectorRef
    ) {
        super(injector, cdRef);
    }

}
