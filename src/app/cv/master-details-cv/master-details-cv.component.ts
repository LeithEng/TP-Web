import { Component, inject, Signal, computed, effect } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoggerService } from 'src/app/services/logger.service';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ListComponent } from '../list/list.component';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { EmbaucheComponent } from '../embauche/embauche.component';

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [ListComponent, UpperCasePipe, DatePipe, RouterOutlet, EmbaucheComponent],
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css'],
})
export class MasterDetailsCvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);
  private router = inject(Router);
  private acr = inject(ActivatedRoute);
  cvs: Signal<Cv[]> = this.cvService.cvsSignal;
  selectedCv: Signal<Cv | null> = this.cvService.selectedCvSignal;
  date = new Date();
  cvsCount = computed(() => this.cvs().length);
  hasCvs = computed(() => this.cvs().length > 0);
  hasSelectedCv = computed(() => this.selectedCv() !== null);
  averageAge = computed(() => {
    const cvsList = this.cvs();
    if (cvsList.length === 0) return 0;
    const sum = cvsList.reduce((acc, cv) => acc + cv.age, 0);
    return Math.round(sum / cvsList.length);
  });

  constructor() {
    this.logger.logger('je suis le master-details component');
    this.toastr.info('Bienvenu dans notre CvTech');
    effect(() => {
      const cv = this.selectedCv();
      if (cv) {
        this.router.navigate([cv.id], { relativeTo: this.acr });
      }
    });
    effect(() => {
      const count = this.cvsCount();
      if (count > 0) {
        this.logger.logger(`${count} CVs chargés avec succès`);
      }
    });
  }
}
