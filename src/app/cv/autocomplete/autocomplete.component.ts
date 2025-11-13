import { Component, inject, Signal } from "@angular/core";
import { FormBuilder, AbstractControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, Observable, switchMap, tap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { CvService } from "../services/cv.service";
import {JsonPipe, NgStyle} from "@angular/common";
import { Cv } from "../model/cv";
import { DefaultImagePipe } from "../pipes/default-image.pipe";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule,/* JsonPipe , */ DefaultImagePipe,NgStyle],
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);

   size = 50;

  get search(): AbstractControl {
    return this.form.get("search")!;
  }
  form = this.formBuilder.group({ search: [""] });

  Searchresult$ =this.search.valueChanges.pipe(
    debounceTime(300),
    //filter to avoid empty searches
    filter(name => !!name && name.trim().length > 0), //!!name to avoid null or undefined
    distinctUntilChanged(),
    tap(() => console.log('Recherche en cours...')),
    switchMap((name)=>this.cvService.selectByName(name))
  )
  searchResults = toSignal(this.Searchresult$,{initialValue:[]})

  onSelectCv(cv: Cv) {
    this.cvService.selectCv(cv);
    this.search.setValue(cv.name);
  }
}
