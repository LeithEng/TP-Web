import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { CvService } from '../services/cv.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

@Component({
  selector: 'app-details',
  imports: [AsyncPipe, NgStyle, DefaultImagePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  private acr = inject(ActivatedRoute);
  private cvService = inject(CvService);
  /*
  id$= this.acr.params.pipe(
    map(params => params['id'])
  )*/

  id = this.acr.snapshot.params['id'];

  
  cv = toSignal(
    this.acr.params.pipe(
      map(params => params['id']),
      switchMap(id => this.cvService.getCvById(id)),
      catchError(() => {
        return of(null);
      })
    )
    ,{ initialValue: null }
  );


}
