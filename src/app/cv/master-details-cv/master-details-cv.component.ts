import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoggerService } from 'src/app/services/logger.service';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { EmbaucheComponent } from '../embauche/embauche.component';
import { ListComponent } from '../list/list.component';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-master-details-cv',
  imports: [
    ListComponent,
    EmbaucheComponent,
    UpperCasePipe,
    DatePipe,
    
    RouterOutlet,

],
  templateUrl: './master-details-cv.component.html',
  styleUrl: './master-details-cv.component.css'
})
export class MasterDetailsCvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  cvs: Cv[] = [];
  selectedCv: Cv | null = null;
  date = new Date();

  constructor() {
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs = cvs;
      },
      error: () => {
        this.cvs = this.cvService.getFakeCvs();
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    this.cvService.selectCv$.subscribe((cv) => (this.selectedCv = cv));
  }
}
