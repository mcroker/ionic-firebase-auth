import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface PasswordRequirement {
  minimumLength: number;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireSpecial: boolean;
  requireNumbers: boolean;
}

export const PASSWORD_REQUIREMENT: PasswordRequirement = {
  minimumLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireSpecial: true,
  requireNumbers: true
};
@Injectable({ providedIn: 'root' })
export class AuthValidatorsService {

  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const requirement = PASSWORD_REQUIREMENT;
    let errors: ValidationErrors | null = null;
    if (control.value) {
      if (requirement.minimumLength && control.value.length < requirement.minimumLength) {
        if (!errors) { errors = {}; }
        errors.minLength = { value: control.value };
      }
      if (requirement.requireLowercase && (!/[a-z]/.test(control.value))) {
        if (!errors) { errors = {}; }
        errors.requireLowercase = { value: control.value };
      }
      if (requirement.requireUppercase && (!/[A-Z]/.test(control.value))) {
        if (!errors) { errors = {}; }
        errors.requireUppercase = { value: control.value };
      }
      if (requirement.requireSpecial && (!/[!@#\$%\^&]/.test(control.value))) {
        if (!errors) { errors = {}; }
        errors.requireSpecial = { value: control.value };
      }
      if (requirement.requireNumbers && (!/[0-9]/.test(control.value))) {
        if (!errors) { errors = {}; }
        errors.requireNumbers = { value: control.value };
      }
      if (errors) {
        errors.passwordStrength = { value: control.value };
      }
    }
    return errors;
  }

  constructor(
  ) {
  }

}
