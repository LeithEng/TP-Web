import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { JsonPipe } from "@angular/common";
import { debounce, debounceTime } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { cinUniqueValidator } from "../validators/cin-unique.validator";
import { cinAgeValidator } from "../validators/cin-age.validator";

@Component({
    selector: "app-add-cv",
    templateUrl: "./add-cv.component.html",
    styleUrls: ["./add-cv.component.css"],
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
],
})
export class AddCvComponent implements OnInit {
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private readonly STORAGE_KEY = 'addCvFormData';

  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
          asyncValidators: [cinUniqueValidator(this.cvService)],
          //updateOn: "blur",
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
    {
      validators: [cinAgeValidator()],
    }
  );

  ngOnInit(): void {
    this.age.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((age) => {
      if (age < 18 && age){
        this.path?.setValue("");
        this.path?.disable();
        this.toastr.info("path is disabled for minors");
      }
      else{
        this.path?.enable();
      }
      
    })

    this.loadFromLocalStorage();

    this.form.valueChanges.pipe(
      debounceTime(500),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next : () => {
        const formData = this.form.getRawValue();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formData));
      }
    })
    
  }

  private loadFromLocalStorage(){
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data){
      try{
        const formData = JSON.parse(data);
        this.form.patchValue(formData);
        this.toastr.info("Restored saved form data.");
      }
      catch (error){
        this.toastr.error("Failed to parse saved form data.");
      }
    }
  }
/*
  private saveToLocalStorage(){
    const formData = this.form.getRawValue();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formData));
  }
*/

 

  addCv() {
    
    this.cvService.addCv(this.form.getRawValue() as Cv).subscribe({
      next: (cv) => {
        
        localStorage.removeItem(this.STORAGE_KEY);
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
    
   console.log(this.form.getRawValue());
  }

  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
