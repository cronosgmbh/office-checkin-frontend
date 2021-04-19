import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import { BookingsService } from '../../../services/bookings.service';
import { Booking } from '../../../models/booking.model';
import { DialogHelperService, DialogResult } from '../../../services/dialog-helper.service';
import { DatePipe } from '@angular/common';
import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AreasService } from '../../../services/areas.service';
import { ProcessHelperService } from 'process-helper';
import {CronosBooking} from '../../../models/cronos-booking';
import * as moment from 'moment';

export interface BookingViewModel extends Booking {
  dateKey: string;
  presence: number;
}

export interface CronosBookingViewModel extends CronosBooking {
  dataKey: string;
  presence: number;
}

@Component({
  selector: 'app-booking-view',
  templateUrl: './bookings-view.component.html',
  styleUrls: ['./bookings-view.component.scss'],
  animations: [fadeInAnimation],
})
export class BookingsViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  public displayedColumns: string[] = ['date', 'room', 'presence', 'action'];

  public dataSource: any = null;

  private unsubscribe$ = new Subject<void>();
  /**
   * Contains bookings which are in the process of being removed
   * @private
   */
  private upForRemoval: string[] = [];

  constructor(
    private bookingsService: BookingsService,
    private areasService: AreasService,
    private dialogHelper: DialogHelperService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private processHelperService: ProcessHelperService,
  ) {
  }

  ngOnInit(): void {
    this.loadRecentBookings();
  }

  requestBookingDelete(booking: CronosBookingViewModel) {
    this.processHelperService.builder<{ dialogResult: DialogResult }>()
      .dialog('confirmation', 'BOOKINGS.ADD.DIALOG.CONFIRMATION.TITLE',
        'BOOKINGS.ADD.DIALOG.CONFIRMATION.MESSAGE', ['COMMON.BUTTONS.CANCEL', 'COMMON.BUTTONS.DELETE'],
        null, 'help', 'dialogResult')
      .assert((ctx) => ctx.dialogResult?.clickIndex === 1, () => {
      })
      .reckon(() => this.bookingsService.remove(booking).toPromise())
      .do(() => this.removeFromRemoval(booking))
      .dialog(
        'success',
        'BOOKINGS.LIST.TABLE.ACTION.DELETE_BOOKING',
        this.translateService.instant('BOOKINGS.LIST.TABLE.ACTION.DELETE_BOOKING_CONF', {
          date: this.datePipe.transform(booking.date),
        }),
        ['COMMON.BUTTONS.OK'],
        null
      )
      .run('bookings-confirmation-dialog', this.unsubscribe$, this, () => {
        this.showDeleteBookingError();
      });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  isDeleting(booking: BookingViewModel): boolean {
    return this.upForRemoval.includes(booking.dateKey);
  }

  private loadRecentBookings(): void {
    this.bookingsService.getBookings().subscribe(bookings => {
      console.log(bookings);
      this.dataSource = bookings.bookings || [];
      this.dataSource.sort((a, b) => {
        if (a.date === b.date) {
          return 0;
        }
        const da = moment(a.date);
        const db = moment(b.date);
        if (da.isBefore(db)) {
          return -1;
        }
        return 1;
      });
    }, _ => this.dataSource = false );
  }

  private removeFromRemoval(booking: CronosBookingViewModel): void {
    this.upForRemoval = this.upForRemoval.filter(id => id !== booking.id);
    this.loadRecentBookings();
  }

  private showDeleteBookingError() {
    this.dialogHelper.showErrorDialog({
      title: this.translateService.instant('BOOKINGS.ADD.ERRORS.DELETE_BOOKING_TITLE'),
      message: this.translateService.instant('BOOKINGS.ADD.ERRORS.DELETE_BOOKING_MESSAGE'),
    });
  }
}
