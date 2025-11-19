import { Component, Signal } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { catchError, Observable, of, tap } from "rxjs";
@Component({
  standalone: false,
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent {
  cvs$! : Observable<Cv[]> ;
  selectedCv$! : Observable<Cv | null>; 
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    this.initializeCvs();
    this.initializeSelectedCv();
  }

  private initializeCvs(): void {
    this.cvs$ = this.cvService.getCvs().pipe(
      tap((cvs) => {
        this.logger.logger(`Nombre de cvs reçus ${cvs.length}`);
                    }
          ),
      catchError((error) => {
        this.logger.logger(
          "Erreur lors du chargement des cvs depuis l'API, chargement des cvs fictifs."
        );
        return of(this.cvService.getFakeCvs());
      }
      )
    );
  }

  private initializeSelectedCv(): void {
    this.selectedCv$ = this.cvService.selectCv$.pipe(
      tap((cv) => {
        this.logger.logger(`Cv sélectionné : ${cv?.firstname}`);
      }),
      catchError((error) => {
        this.logger.logger("Erreur lors de la sélection du cv.");        
          return of(null);
        }
      )
);
  }


}
