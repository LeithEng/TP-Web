import { Component, inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { JsonPipe } from "@angular/common";

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
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
  );

  ngOnInit(): void {
    this.age.valueChanges.subscribe((age) => {
      if (age < 18 && age){
        this.path?.setValue("");
        this.path?.disable();
        this.toastr.info("path is disabled for minors");
      }
      else{
        this.path?.enable();
      }
      
    })
  }

  addCv() {
    
    this.cvService.addCv(this.form.getRawValue() as Cv).subscribe({
      next: (cv) => {
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
