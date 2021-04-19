import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomBookingStatus} from '../add-booking-view/add-booking-view.component';
import * as moment from 'moment';
import {ApiService} from '../../../services/api.service';
import {CronosBooking} from '../../../models/cronos-booking';
import {Visit} from '../../../models/visit.model';
import {DialogHelperService, DialogResult} from '../../../services/dialog-helper.service';
import {VisitorService} from '../../../services/visitor.service';
import {ProcessHelperService} from 'process-helper';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import * as FileSaver from 'file-saver';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookings-overview',
  templateUrl: './bookings-overview.component.html',
  styleUrls: ['./bookings-overview.component.scss']
})
export class BookingsOverviewComponent implements OnInit, OnDestroy {

  constructor(private api: ApiService,
              private http: HttpClient,
              private visitorService: VisitorService,
              private snackBar: MatSnackBar,
              private processHelper: ProcessHelperService,
              private dialogHelper: DialogHelperService) { }

  bookings: CronosBooking[];
  visits: Visit[] = [];
  displayedColumns: string[] = ['date', 'user', 'area'];
  showingAllBookings = true;

  bookingsByArea: BookingsByArea[] = [];
  bookingsForDateCount = 0;
  selectedDate: string;

  private unsubscribe$: Subject<void> = new Subject<void>();

  dateClass = (date: Date) => 'cronos-date';

  isDateBookable: (date: Date) => RoomBookingStatus = (date: Date) => {
    return RoomBookingStatus.AVAILABLE;
  }

  orderByDates = (a: CronosBooking, b: CronosBooking) => {
    if (a.date === b.date) {
      return 0;
    }
    const da = moment(a.date);
    const db = moment(b.date);
    if (da.isBefore(db)) {
      return -1;
    }
    return 1;
  }


  ngOnInit(): void {
    this.dateSelectionChanged(null);
  }

  getUsageClass(capacity: number, usage: number) {
    if (capacity === usage) {
      return 'full';
    }
    if (capacity >= 3 && usage < capacity - 2) {
      return 'almost-empty';
    }
    return 'used';
  }

  infoForVisit(visit: Visit) {
    this.dialogHelper.showInfoDialog({
      title: visit.visitor.FirstName + ' ' + visit.visitor.LastName,
      message: visit.additional_info === '' ? 'Keine weiteren Anmerkungen' : visit.additional_info,
    });
  }

  printCardForVisit(visit: Visit) {
  }

  async printCardsForDate() {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Token ' + localStorage.getItem('idToken'));
    const data = await this.http.get(environment.api_url + '/admin/visitor-badges/' + this.selectedDate,
      { headers, responseType: 'blob' }
      ).toPromise();
    FileSaver.saveAs(data, 'badges-' + this.selectedDate + '.pdf');
  }

  deleteVisit(visit: Visit) {
    this.processHelper.builder<{ dialogResult: DialogResult }>()
      .dialog('confirmation', 'Besucheraufenthalt entfernen',
        'Möchtest du die Besucherbuchung entfernen?', ['COMMON.BUTTONS.CANCEL', 'COMMON.BUTTONS.DELETE'],
        null, 'help', 'dialogResult')
      .assert((ctx) => ctx.dialogResult?.clickIndex === 1, () => {
      })
      .reckon(() => this.visitorService.deleteVisit(visit.ID).toPromise())
      .do(() => this._fetchForSingleDay(this.selectedDate))
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
  async dateSelectionChanged(event) {
    if (event === null) {
      await this._fetchForSingleDay(moment(Date.now()).format('yyyy-MM-DD'));
      return;
    }
    const d = moment(event.value).format('yyyy-MM-DD');
    if (d === 'Invalid date') {
      const bookings = await this.api.get('/admin/bookings').toPromise();
      this.bookings = bookings || [];
      this.showingAllBookings = true;
      this.selectedDate = '';
    } else {
      await this._fetchForSingleDay(d);
      return;
    }
    this.bookings = this.bookings.sort(this.orderByDates);
  }

  resendInvitationMail(visit: Visit) {
    this.api.post(`/invitations/${visit.ID}/resend-mail`, {})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.snackBar.open('Die E-Mail wurde versendet', 'OK', {duration: 3500});
      });
  }

  private showDeleteBookingError() {
    this.dialogHelper.showErrorDialog({
      title: 'Fehler',
      message: 'Beim löschen ist ein Fehler aufgetreten. Bitte versuche es später erneut. Sollte der Fehler bestehen, wende dich bitte an deinen Administrator.',
    });
  }

  private async _fetchForSingleDay(d: string) {
    const response = await this.api.get('/admin/bookings/' + d).toPromise();
    this.showingAllBookings = false;
    this.selectedDate = d;
    this.bookingsByArea = [];
    this.bookingsForDateCount = response.visits.length;
    this.visits = response.visits;
    console.log(response);
    if (!response) {
      return;
    }
    if (response.bookings.length === 0) {
      return;
    }
    response.bookings.forEach((key, value) => {
      if (!this.bookingsByArea.find(f => f.name === key.area_data.name)) {
        this.bookingsByArea.push({name: key.area_data.name, bookings: [], capacity: key.area_data.capacity});
      }
      this.bookingsByArea.find(f => f.name === key.area_data.name).bookings.push(key.user_name);
      this.bookingsForDateCount++;
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

}

interface BookingsByArea {
  name: string;
  capacity: number;
  bookings: string[];
}
