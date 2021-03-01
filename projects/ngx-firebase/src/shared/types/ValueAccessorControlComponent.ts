import { Input, Output, EventEmitter, OnDestroy, AfterViewInit, Injector, ChangeDetectorRef, OnInit, Component } from '@angular/core';
import { ControlValueAccessor, Validator, ValidationErrors, AbstractControl, FormControl, NgControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export class ValueAccessorControlComponent<T> implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit {

  public parentControl?: NgControl | null;
  public control?: FormControl;
  private get _control(): FormControl {
    if (!this.control) {
      throw new Error('ValueAccessorControlComponent: this.control must be eclipsed in the subclass');
    }
    return this.control;
  }

  protected destroy$: ReplaySubject<void> = new ReplaySubject<void>();

  @Input()
  set value(val: T | undefined) {
    if (val) {
      this._control.setValue(val);
    } else {
      this._control.reset();
    }
  }
  get value(): T | undefined {
    return this._control.value;
  }

  @Output()
  valueChange: EventEmitter<T | undefined> = new EventEmitter<T | undefined>();

  constructor(
    private injector: Injector,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (this._control.dirty) {
          this.propagateChange(val);
          this.propagateTouch();
          this.valueChange.emit(val);
        }
      });
    this._control.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.propagateValidatorChange());
  }

  ngAfterViewInit() {
    this.parentControl = this.injector.get(NgControl, null);
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  propagateChange = (val: T | undefined) => { };
  propagateTouch = () => { };
  propagateValidatorChange = () => { };

  writeValue(value: T | undefined) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouch = fn;
  }

  registerOnValidatorChange(fn: () => void) {
    this.propagateValidatorChange = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this._control.disable();
    } else {
      this._control.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this._control.errors;
  }

}
