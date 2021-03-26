// Angular & Inionc
import { Component, forwardRef, Inject, Input, OnDestroy, OnInit, } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';

// RxJS
import { Subject } from 'rxjs';

// Mal
import { AuthProcessService, UiService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';
import { takeUntil } from 'rxjs/operators';

type ValueType = boolean | undefined;
@Component({
  selector: 'mal-authui-terms-field',
  templateUrl: './terms-field.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AuthUITermsFieldComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: AuthUITermsFieldComponent, multi: true }
  ]
})
export class AuthUITermsFieldComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  termsForm: FormGroup = new FormGroup({
    tos: new FormControl(true, []),
    privacyPolicy: new FormControl(true, [])
  });

  // Config
  tosUrl = this.config.authUi.tosUrl;
  privacyPolicyUrl = this.config.authUi.privacyPolicyUrl;

  // Private
  private destroy$: Subject<void> = new Subject<void>();

  @Input()
  set value(val: ValueType) {
    if (val) {
      this.termsForm.patchValue({
        tos: val,
        privacyPolicy: val
      });
    } else {
      this.termsForm.reset();
    }
  }
  get value(): ValueType {
    return this.termsForm.controls.tos.value && this.termsForm.controls.privacyPolicy.value;
  }

  propogateChange = (val: ValueType) => { };
  propogateTouch = () => { };
  propogateValidationChange = () => { };

  // tslint:disable-next-line @typescript-eslint/ban-types
  constructor(
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    public aps: AuthProcessService,
    private ui: UiService,
  ) {
    this.termsForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        try {
          this.propogateValidationChange()
        } catch (error) {
          this.ui.logError(error);
        }
      });
  }

  // Form Accessor functions
  registerOnChange(fn: any) { this.propogateChange = fn; }
  registerOnTouched(fn: any) { this.propogateTouch = fn; }
  registerOnValidatorChange?(fn: () => void) { this.propogateValidationChange = fn; }
  writeValue(val: ValueType) { this.value = val; }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.termsForm.controls.tos.errors || this.termsForm.controls.privacyPolicy.errors) {
      return Object.assign(this.termsForm.controls.tos.errors || {}, this.termsForm.controls.privacyPolicy.errors || {});
    } else {
      return null;
    }
  }

  ngOnInit(): void {
    // If tos or privacy policy url set, ensure that the two form items are required
    if (this.config.authUi.tosUrl) {
      this.termsForm.controls.tos.setValidators(Validators.requiredTrue);
    }
    if (this.config.authUi.privacyPolicyUrl) {
      this.termsForm.controls.privacyPolicy.setValidators(Validators.requiredTrue);
    }
    this.termsForm.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
