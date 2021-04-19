import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingsService } from '../../../services/bookings.service';
import { DialogHelperService } from '../../../services/dialog-helper.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { AreasService } from '../../../services/areas.service';
import { Area } from '../../../models/area.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { Navigation, NavigationService } from '../../../services/navigation.service';
import { BookingSuccessfulDialogContentComponent } from '../booking-successful-dialog-content/booking-successful-dialog-content.component';
import {CronosArea} from '../../../models/cronos-area.model';
import {Forecast, ForecastItem} from '../../../models/forecast.model';
import {BookingFailedDialogContentComponent} from '../booking-failed-dialog-content/booking-failed-dialog-content.component';

export enum RoomBookingStatus {
  AVAILABLE,
  UNAVAILABLE,
  FULL,
  ALREADY_BOOKED
}

@Component({
  selector: 'app-add-booking-view',
  templateUrl: './add-booking-view.component.html',
  styleUrls: ['./add-booking-view.component.scss'],
  animations: [fadeInAnimation],
})
export class AddBookingViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  maxBookableDays = 3;
  areaFormGroup: FormGroup;
  dateFormGroup: FormGroup;
  readonly confirmBookingBtnOptions: MatProgressButtonOptions = {
    active: false,
    disabled: true,
    text: 'Confirm Booking',
    spinnerSize: 19,
    fullWidth: false,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
  };
  user;
  areas: Area[] | null = null;
  cronosAreas: CronosArea[] | null = null;
  cronosMSAreas: CronosArea[] | null = null;
  cronosHHAreas: CronosArea[] | null = null;
  cronosMAreas: CronosArea[] | null = null;
  cronosViennaAreas: CronosArea[] | null = null;

  private unsubscribe$ = new Subject<void>();
  public selectedArea: string;
  public startDate = '';
  public endDate = '';
  public forecast: Forecast;
  private selectedDates: Date[];
  private bookedDates: string[];
  private fullDates: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private areaService: AreasService,
    private bookingsService: BookingsService,
    private dialogHelper: DialogHelperService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.translateService.stream('BOOKINGS.ADD.BUTTONS.ADD_BOOKING.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe((res: string) => {
      this.confirmBookingBtnOptions.text = res;
    });
  }

  isDateBookable: (date: Date) => RoomBookingStatus = (date: Date) => {
    if (moment(date) < moment().startOf('day')) {
      return RoomBookingStatus.UNAVAILABLE;
    }

    if (!this.selectedArea) {
      return RoomBookingStatus.UNAVAILABLE;
    }
    const d = moment(date).format('yyyy-MM-DD');
    if (this.bookedDates.findIndex(i => i === d) !== -1) {
      return RoomBookingStatus.ALREADY_BOOKED;
    }

    if (this.fullDates.findIndex(i => i === d) !== -1) {
      return RoomBookingStatus.FULL;
    }
    return RoomBookingStatus.AVAILABLE;
  }

  dateClass = (date: Date) => {
    switch (this.isDateBookable(date)) {
      case RoomBookingStatus.FULL:
        return 'full';
      case RoomBookingStatus.ALREADY_BOOKED:
        return 'already-booked';
      default:
        return null;
    }
  }

  ngOnInit(): void {
    this.areaFormGroup = this.formBuilder.group({
      areaControl: ['', Validators.required],
    });
    this.dateFormGroup = this.formBuilder.group({
      dateControl: ['', Validators.required],
    });
    this.areaService.getAllAreas()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(areas => {
      this.cronosAreas = areas.areas;
      this.cronosMAreas = areas.areas.filter(f => f.location === 'München');
      this.cronosMSAreas = areas.areas.filter(f => f.location === 'Münster').sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.cronosHHAreas = areas.areas.filter(f => f.location === 'Hamburg');
      this.cronosViennaAreas = areas.areas.filter(f => f.location === 'Wien');
    });
    this.bookingsService.getBookings()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(bookings => {
      this.bookedDates = [];
      if (bookings.bookings && bookings.bookings.length > 0) {
        bookings.bookings.forEach(booking => {
          this.bookedDates.push(booking.date);
        });
      }
    });
  }

  bookArea(): void {
    this.confirmBookingBtnOptions.active = true;
    this.bookingsService.add(this.selectedArea, this.selectedDates, this.startDate, this.endDate).subscribe(next => {
      this.confirmBookingBtnOptions.active = false;
      this.dialogHelper.showSuccessDialog({
        title: 'BOOKINGS.ADD.DIALOG.SUCCESS.TITLE',
        message: 'BOOKINGS.ADD.DIALOG.SUCCESS.MESSAGE',
        content: {
          element: BookingSuccessfulDialogContentComponent,
          data: {
            area: this.selectedArea,
            dates: this.selectedDates,
          },
        },
      }).afterClosed().toPromise().then(() => this.navigationService.go(Navigation.BOOKINGS_DONE));
    }, error => {
      this.confirmBookingBtnOptions.active = false;
      this.dialogHelper.showErrorDialog({
        title: 'Fehler beim buchen',
        message: 'Beim Buchen ist ein Fehler aufgetreten. Bitte überprüfen Sie die Eingaben',
        content: {
          element: BookingFailedDialogContentComponent,
          data: {
            area: this.selectedArea,
            errors: error.errors,
          },
        },
      });
    });
  }

  async areaSelected($event) {
    // Load area data
    this.selectedDates = [];
    this.selectedArea = null;
    this.selectedArea = $event.value;
    this.areaService.getFullDatesForArea($event.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
      next => {
        this.fullDates = next.dates;
      }, error => console.error(error)
    );
    this.areaService.getForecastForArea($event.value, 10)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(next => {
        console.log(next);
        this.forecast = next;
        this.forecast.bookings = this.forecast.bookings.sort((a, b) => {
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
      });
  }

  dateSelectionChanged(dates: Date[]) {
    this.selectedDates = dates || [];
    this.confirmBookingBtnOptions.disabled = this.selectedDates.length === 0;
  }

  startDateChanged(event) {
    this.startDate = moment(event.value).format('yyyy-MM-DD');
    this.confirmBookingBtnOptions.disabled = (this.startDate === '' || this.endDate === '');

  }

  endDateChanged(event) {
    this.endDate = moment(event.value).format('yyyy-MM-DD');
    this.confirmBookingBtnOptions.disabled = (this.startDate === '' || this.endDate === '') || this.startDate === this.endDate;
  }

  forecastClass(capacity: number, fi: ForecastItem) {
    if (fi.booked_by_myself) {
      return 'by-self';
    }
    if (fi.booked_seats === 0) {
      return 'free';
    }
    if (fi.booked_seats !== 0 && fi.booked_seats < capacity) {
      return 'used';
    }
    if (fi.booked_seats === capacity) {
      return 'full';
    }
  }

  forecastInfo() {
    this.dialogHelper.showInfoDialog({
      title: 'Auslastungsanzeige',
      icon: '',
      message: 'Blau: Von dir gebuchtes Datum<br>Rot: Keine Plätze frei.<br>Gelb: Teilweise belegt<br>Grün: Keine Buchungen'
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }
}
