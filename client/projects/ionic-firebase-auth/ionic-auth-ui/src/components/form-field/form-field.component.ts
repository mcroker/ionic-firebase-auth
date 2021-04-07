import { Component, Input } from '@angular/core';
import { FormControl, NgControl, ValidationErrors } from '@angular/forms';
import { UiService } from 'ionic-firebase-auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

type ControlType = NgControl | FormControl | undefined | null;

@Component({
  selector: 'auth-form-field',
  templateUrl: 'form-field.component.html',
  styleUrls: ['form-field.component.scss', '../../ionic-auth-ui.scss']
})
export class AuthUIFormFieldComponent {

  @Input() label: string = '';

  @Input()
  get control(): ControlType { return this.control$.value; }
  set control(val: ControlType) { this.control$.next(val); }
  private control$: BehaviorSubject<ControlType> = new BehaviorSubject<ControlType>(undefined);

  public errors$: Observable<string[]> = this.control$.pipe(
    switchMap(control => (control && control.statusChanges)
      ? control.statusChanges.pipe(startWith(control.errors), map(_ => this.errorMessageFn(control.errors)))
      : of([])
    ),
    catchError(error => {
      this.ui.logError(error);
      return of([error.message]);
    })
  );

  public readonly isValid$: Observable<boolean> = this.control$.pipe(
    switchMap(control => (control && control.statusChanges)
      ? control.statusChanges.pipe(startWith(control.valid), map(() => control.valid || false))
      : of(true)
    )
  );

  public readonly isDisabled$: Observable<boolean> = this.control$.pipe(
    switchMap(control => (control && control.statusChanges)
      ? control.statusChanges.pipe(startWith(control.disabled), map(() => control.disabled || false))
      : of(true)
    )
  );

  @Input() errorMessage?: string;
  @Input() errorMessageFn: (errors: ValidationErrors | null) => string[] = this.flattenErrors.bind(this);
  @Input() errorPrefix?: string;
  @Input() customErrors?: { [index: string]: string };
  @Input() translateParams: { [key: string]: string } = {};
  @Input() icon?: string;
  @Input() hintEnd?: string;

  constructor(
    private ui: UiService
  ) { }

  private flattenErrors(errors: ValidationErrors | null): string[] {
    if (errors) {
      if (this.customErrors || this.errorPrefix) {
        return Object.keys(errors)
          .map(key => {
            if (this.customErrors) {
              if (undefined !== this.customErrors[key]) {
                return this.customErrors[key];
              } else if (undefined !== this.customErrors.default) {
                return this.customErrors.default;
              } else {
                return '';
              }
            } else if (this.errorPrefix) {
              return `${this.errorPrefix}.${key}`;
            }
          })
          .filter(item => !!item) as string[] || [];
      } else if (this.errorMessage) {
        return [this.errorMessage];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

}
