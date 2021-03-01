import { Input, Output, EventEmitter, Component } from '@angular/core';
import { ControlValueAccessor, Validator, ValidationErrors, AbstractControl } from '@angular/forms';

declare type ValueAccessorHandler<T> = (_: T) => void;
declare type ValidatorChangeHandler = () => void;

@Component({
  template: ''
})
export class ValueAccessorValueComponent<T> implements ControlValueAccessor, Validator {

  @Input()
  get value(): T | undefined { return this._value; }
  set value(val: T | undefined) {
    if (val) {
      this._value = val;
      this.valueChange.emit(val);
      this.propagateChange(val);
    }
  }
  protected _value: T | undefined;

  @Output()
  valueChange: EventEmitter<T> = new EventEmitter<T>();

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  propagateChange: ValueAccessorHandler<T> = (_: T) => { };
  propagateTouch: ValueAccessorHandler<T> = (_: T) => { };  // TODO - Not implemented.
  propagateValidatorChange: ValidatorChangeHandler = () => { };  // TODO - Not implemented.

  writeValue(value: T) {
    this.value = value;
  }

  registerOnChange(fn: ValueAccessorHandler<T>) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: ValueAccessorHandler<T>) {
    this.propagateTouch = fn;
  }

  registerOnValidatorChange(fn: ValidatorChangeHandler) {
    this.propagateValidatorChange = fn;
  }

}
