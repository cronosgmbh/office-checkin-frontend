import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Visit} from '../../../models/visit.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-accept-view',
  templateUrl: './accept-view.component.html',
  styleUrls: ['./accept-view.component.scss']
})
export class AcceptViewComponent implements OnInit, OnDestroy {

  visit: Visit = {};
  hasFetched = false;
  hasError = false;
  isAccepted = false;
  currentLang = 'de';

  private unsubscribe$ = new Subject<void>();


  constructor(
    private router: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService,

  ) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      if (params.id && params.id !== '') {
        const visitID = params.id;
        this.http.get(`${environment.api_url}/invitations/${visitID}`).subscribe(result => {
          this.visit = result;
          this.hasFetched = true;
          this.hasError = false;
          this.isAccepted = this.visit.has_accepted;
        }, error => {
          console.error(error);
          this.hasFetched = true;
          this.hasError = true;
        });
      }
    });

    this.currentLang = this.translate.currentLang;

    // Update lang tag on html element on language change
    this.translate.onLangChange.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      console.log(this.translate.currentLang);
      this.currentLang = this.translate.currentLang;
    });
  }

  acceptInvitation() {
    const visitID = this.visit.ID;
    this.isAccepted = true;
    this.http.patch(`${environment.api_url}/invitations/${visitID}`, {}).subscribe(result => {
      console.log(result);
      this.snackBar.open('Die Einladung wurde bestätigt!', 'OK', {
        duration: 4500
      });
    }, error => {
      console.error(error);
      this.isAccepted = false;
      // TODO: Show error message
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
