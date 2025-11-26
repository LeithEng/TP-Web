import {
  Component,
  effect,
  inject,
  input,
  resource,
  Signal,
} from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { rxResource } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
  standalone: true,
  imports: [DefaultImagePipe, JsonPipe],
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);
  private idFromRoute = input.required<string>({ alias: 'id' });
  cvResource = rxResource({
    request: () => ({ id: +this.idFromRoute() }),
    loader: ({ request }) => this.cvService.getCvById(request.id),
  });
  cv = this.cvResource.value;
  isLoading = this.cvResource.isLoading;
  error = this.cvResource.error;

  constructor() {
    effect(() => {
      const error = this.cvResource.error();
      if (error) {
        this.toastr.error('CV introuvable');
        this.router.navigate([APP_ROUTES.cv]);
      }
    });
  }

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.cvService.updateCvsAfterDelete(cv.id);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}
