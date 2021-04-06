import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Inject, Injector, Input, OnDestroy } from '@angular/core';
import {
    AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators,
    FormGroup, NG_VALIDATORS, Validator, ValidationErrors, NgControl
} from '@angular/forms';
import { UiService, AuthSharedConfig, AuthSharedConfigToken } from 'ionic-firebase-auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { confirmPasswordValidator, passwordStrengthValidator } from './passwordValidatorFunctions';

type ValueType = string | undefined;

@Component({
    selector: 'auth-authui-password-field',
    templateUrl: 'password-field.component.html',
    styleUrls: ['../../ionic-auth-ui.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AuthUIPasswordFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: AuthUIPasswordFieldComponent, multi: true }]
})
export class AuthUIPasswordFieldComponent implements ControlValueAccessor, Validator, OnDestroy, AfterViewInit {

    // Validators are added by set validators function
    public form: FormGroup = new FormGroup({
        password: new FormControl('', []),
        passwordConfirm: new FormControl('', [])
    });

    public autocomplete: string = 'current-password';

    @Input()
    set forUpdate(val: boolean) {
        this._forUpdate = val;
        this.setValidators();
        if (val) {
            this.autocomplete = 'new-password';
        } else {
            this.autocomplete = 'current-password';
        }
    }
    get forUpdate(): boolean {
        return this._forUpdate;
    }
    private _forUpdate: boolean = false;

    @Input()
    set value(val: ValueType) {
        if (val) {
            this.form.patchValue({
                password: val,
                passwordConfirm: val
            });
        } else {
            this.form.reset();
        }
    }
    get value(): ValueType {
        return this.form.controls.password.value;
    }

    public isDisabled: boolean = false;
    public parentControl?: NgControl | null;

    private destroy$: Subject<void> = new Subject<void>();

    propogateChange = (val: ValueType) => { };
    propogateTouch = () => { };
    propogateValidationChange = () => { };

    constructor(
        @Inject(forwardRef(() => AuthSharedConfigToken)) public config: AuthSharedConfig,
        private injector: Injector,
        private cdRef: ChangeDetectorRef,
        private ui: UiService
    ) {
        this.setValidators();
        this.form.controls.password.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => {
                try {
                    this.form.controls.passwordConfirm.updateValueAndValidity();
                    this.propogateChange(val);
                } catch (error) {
                    this.ui.logError(error);
                }
            });
        this.form.statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(_ => {
                try {
                    this.propogateValidationChange()
                } catch (error) {
                    this.ui.logError(error);
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit() {
        this.parentControl = this.injector.get(NgControl, null);
        this.setValidators();
        this.cdRef.detectChanges();
    }

    // Form Accessor functions
    registerOnChange(fn: any) { this.propogateChange = fn; }
    registerOnTouched(fn: any) { this.propogateTouch = fn; }
    registerOnValidatorChange?(fn: () => void) { this.propogateValidationChange = fn; }
    writeValue(val: ValueType) { this.value = val; }
    setDisabledState(isDisabled: boolean) { this.isDisabled = isDisabled; }
    validate(control: AbstractControl): ValidationErrors | null {
        if (this.form.controls.password.errors || this.form.controls.passwordConfirm.errors) {
            return Object.assign(this.form.controls.password.errors || {}, this.form.controls.passwordConfirm.errors || {});
        } else {
            return null;
        }
    }

    private setValidators() {
        if (this.forUpdate) {
            this.form.controls.password.setValidators([
                Validators.maxLength(this.config.authUi.passwordMaxLength),
                Validators.minLength(this.config.authUi.passwordMinLength),
                passwordStrengthValidator(this.config.authUi)
            ]);
            this.form.controls.passwordConfirm.setValidators([
                confirmPasswordValidator
            ]);
        } else {
            this.form.controls.password.setValidators([]);
            this.form.controls.passwordConfirm.setValidators([]);
        }
        this.form.controls.password.updateValueAndValidity();
        this.form.controls.passwordConfirm.updateValueAndValidity();
    }

}
