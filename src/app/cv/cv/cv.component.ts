import { Component, inject, Signal, computed, effect } from '@angular/core';
import { Cv } from '../model/cv';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { ListComponent } from '../list/list.component';
import { CvCardComponent } from '../cv-card/cv-card.component';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { EmbaucheComponent } from '../embauche/embauche.component';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
  standalone: true,
  imports: [ListComponent, CvCardComponent, UpperCasePipe, DatePipe, EmbaucheComponent],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);
  cvs: Signal<Cv[]> = this.cvService.cvsSignal;
  selectedCv: Signal<Cv | null> = this.cvService.selectedCvSignal;
  date = new Date();
  hasCvs = computed(() => this.cvs().length > 0);
  cvsCount = computed(() => this.cvs().length);

  constructor() {
    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
    effect(() => {
      const cvs = this.cvs();
      if (cvs.length === 0) {
        this.toastr.warning('Chargement des CVs en cours...');
      }
    });
  }
}
