import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
/**
 * Validateur pour vérifier la corrélation entre l'âge et les deux premiers caractères du CIN
 * - Si age >= 60 ans : les 2 premiers chiffres du CIN doivent être entre 00 et 19
 * - Si age < 60 ans : les 2 premiers chiffres du CIN doivent être > 19
 * 
 * @returns ValidatorFn
 */

export function cinAgeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const cinControl = formGroup.get("cin");
        const ageControl = formGroup.get("age");
        if (!cinControl || !ageControl) {
            return null; 
        }
        const cin = cinControl.value;
        const age = parseInt(ageControl.value);

        if (!cin || !age || cin.length < 2) {
            return null;
        }
        const cinPrefix = parseInt(cin.substring(0, 2), 10);
        if(isNaN(cinPrefix) || isNaN(age)) {
            return null;
        }
        if(age >= 60) {
            if(cinPrefix < 0 || cinPrefix > 19) {
                return { cinAgeMismatch: true };
            }   
        }
        else {
            if(cinPrefix <= 19) {
                return { cinAgeMismatch: true };
            }
        }
        return null;
    }
}