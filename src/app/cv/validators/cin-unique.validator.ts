import { AsyncValidatorFn, AbstractControl } from "@angular/forms";
import { CvService } from "../services/cv.service";
import { map } from "rxjs";
/**
 * validateur asynchrone pour vérifier l'unicité du CIN
 * @param cvService CvService
 * @returns ValidatorFn
 */

export function cinUniqueValidator(cvServive: CvService): AsyncValidatorFn {
    
    return (control: AbstractControl) => {
        if (!control.value) {
            return Promise.resolve(null);
        }
        return cvServive
            .selectByProperty("cin", control.value)
            .pipe(
                map((cvs) =>
                    cvs && cvs.length > 0 ? { cinNotUnique: true } : null
                )
            );
    };
}
