import { Component, Input, Output, EventEmitter, inject } from "@angular/core";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { NgStyle } from "@angular/common";
import { DefaultImagePipe } from "../pipes/default-image.pipe";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterDetailsCvComponent } from "../master-details-cv/master-details-cv.component";

@Component({
    selector: "app-item",
    templateUrl: "./item.component.html",
    styleUrls: ["./item.component.css"],
    standalone: true,
    imports: [NgStyle, DefaultImagePipe],
})
export class ItemComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private acr = inject(ActivatedRoute);

  @Input({ required: true }) cv!: Cv;
  @Input() size = 50;

  onSelectCv() {
    if(this.acr.snapshot.toString().includes("master-detail-cv")){ 
      console.log(this.acr.snapshot.toString());
      this.router.navigate(["/master-detail-cv", this.cv.id]);
    }
    else {
      console.log(this.acr.snapshot.toString());
      this.cvService.selectCv(this.cv);
    }
  }
}
