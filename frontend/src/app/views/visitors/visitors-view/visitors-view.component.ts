import {Component, OnDestroy, OnInit} from '@angular/core';
import {VisitorService} from '../../../services/visitor.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Visit} from '../../../models/visit.model';
import {DialogHelperService, DialogResult} from '../../../services/dialog-helper.service';
import {ProcessHelperService} from 'process-helper';
import {Navigation, NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-visitors-view',
  templateUrl: './visitors-view.component.html',
  styleUrls: ['./visitors-view.component.scss']
})
export class VisitorsViewComponent implements OnInit, OnDestroy {

  visits: Visit[] | null = null;
  displayedColumns = ['date', 'visitor', 'tg', 'action'];

  private unsubscribe$ = new Subject<void>();

  constructor(private visitorService: VisitorService,
              private processHelper: ProcessHelperService,
              private navigationService: NavigationService,
              private dialogHelper: DialogHelperService) { }

  ngOnInit(): void {
    this.visitorService.getAllBookings()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(next => {
        this.visits = next;
    }, error => console.error(error));
  }

  ngOnDestroy() {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  requestDeleteVisit(id: string) {
    this.processHelper.builder<{ dialogResult: DialogResult }>()
      .dialog('confirmation', 'Besucheraufenthalt entfernen',
        'Möchtest du die Besucherbuchung entfernen?', ['COMMON.BUTTONS.CANCEL', 'COMMON.BUTTONS.DELETE'],
        null, 'help', 'dialogResult')
      .assert((ctx) => ctx.dialogResult?.clickIndex === 1, () => {
      })
      .reckon(() => this.visitorService.deleteVisit(id).toPromise())
      .dialog(
        'success',
        'Gelöscht',
        'Die Buchung wurde erfolgreich entfernt',
        ['COMMON.BUTTONS.OK'],
        null
      )
      .run('bookings-confirmation-dialog', this.unsubscribe$, this, () => {
        this.showDeleteBookingError();
      });
  }

  async goToBookVisit() {
    await this.navigationService.go(Navigation.VISITORS_BOOK);
  }

  private showDeleteBookingError() {
    this.dialogHelper.showErrorDialog({
      title: 'Fehler',
      message: 'Beim löschen ist ein Fehler aufgetreten. Bitte versuche es später erneut. Sollte der Fehler bestehen, wende dich bitte an deinen Administrator.',
    });
  }

}
