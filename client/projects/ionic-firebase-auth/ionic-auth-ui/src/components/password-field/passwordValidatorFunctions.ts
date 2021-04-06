import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthUIConfig } from 'ionic-firebase-auth';

export function passwordStrengthValidator(config: AuthUIConfig): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let strengthErrors: ValidationErrors | null = null;
        if (control.value) {
            if (config.passwordMinLength && control.value.length < config.passwordMinLength) {
                return { minlength: true };
            }
            if (config.passwordMaxLength && control.value.length > config.passwordMaxLength) {
                return { maxlength: true };
            }
            if (config.passwordRequireLowercase && (!/[a-z]/.test(control.value))) {
                if (!strengthErrors) { strengthErrors = {}; }
                strengthErrors.requireLowercase = true;
            }
            if (config.passwordRequireUppercase && (!/[A-Z]/.test(control.value))) {
                if (!strengthErrors) { strengthErrors = {}; }
                strengthErrors.requireUppercase = true;
            }
            if (config.passwordRequireSpecial && (!/[!@#\$%\^&]/.test(control.value))) {
                if (!strengthErrors) { strengthErrors = {}; }
                strengthErrors.requireSpecial = true;
            }
            if (config.passwordRequireNumbers && (!/[0-9]/.test(control.value))) {
                if (!strengthErrors) { strengthErrors = {}; }
                strengthErrors.requireNumbers = true;
            }
            if (strengthErrors) {
                return { passwordStrength: strengthErrors };
            }
        }
        return null;
    };
}

export function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (!password.value && !passwordConfirm.value) {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    if (password.value && !passwordConfirm.value) {
        return { passwordConfirmationRequired: true };
    }

    return { passwordsNotMatching: true };
}
