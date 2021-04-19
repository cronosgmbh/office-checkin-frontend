import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Visitor} from '../../../models/visitor.model';
import {ApiService} from '../../../services/api.service';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {BookingsService} from '../../../services/bookings.service';
import {Observable, Subject} from 'rxjs';
import * as moment from 'moment';
import {RoomBookingStatus} from '../../bookings/add-booking-view/add-booking-view.component';
import {VisitorService} from '../../../services/visitor.service';
import {Navigation, NavigationService} from '../../../services/navigation.service';
import {DialogHelperService} from '../../../services/dialog-helper.service';
import {validateHorizontalPosition} from '@angular/cdk/overlay';

@Component({
  selector: 'app-book-visitor-view',
  templateUrl: './book-visitor-view.component.html',
  styleUrls: ['./book-visitor-view.component.scss']
})
export class BookVisitorViewComponent implements OnInit, OnDestroy {


  public selectedDate: any = '';
  visitorForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    Phone: new FormControl('', [Validators.required]),
    Company: new FormControl('', [Validators.required])
  });

  additionalInfoForm = new FormGroup({
    additionalInformation: new FormControl(''),
    needsParkingSpace: new FormControl()
  });

  visitors: Visitor[] = [];
  filteredVisitors: Observable<Visitor[]> = new Observable<Visitor[]>();
  private unsubscribe$ = new Subject<void>();
  private bookedDates: string[];

  isDateBookable: (date: Date) => RoomBookingStatus = (date: Date) => {
    if (moment(date) < moment().startOf('day')) {
      return RoomBookingStatus.UNAVAILABLE;
    }

    const d = moment(date).format('yyyy-MM-DD');
    if (this.bookedDates.findIndex(i => i === d) !== -1) {
      return RoomBookingStatus.AVAILABLE;
    }

    return RoomBookingStatus.UNAVAILABLE;
  }

  dateClass = (date: Date) => {
    switch (this.isDateBookable(date)) {
      case RoomBookingStatus.ALREADY_BOOKED:
        return 'already-booked';
      default:
        return null;
    }
  }

  constructor(private api: ApiService,
              private visitorService: VisitorService,
              private dialogHelper: DialogHelperService,
              private navigation: NavigationService,
              private bookingsService: BookingsService) { }

  ngOnInit(): void {

    this.visitorService.getAllVisitors().subscribe(v => {
      Object.keys(v).forEach(k => {
        this.visitors.push(v[k]);
        this.filteredVisitors = this.visitorForm.controls.Email.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });
    }, error => console.error(error));

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

  selectedUser(v) {
    console.log(v);
    this.visitorForm.setValue({
      FirstName: v.FirstName,
      LastName: v.LastName,
      Email: v.Email,
      Company: v.Company,
      Phone: v.Phone
    });
  }

  dateChanged(event) {
    this.selectedDate = event;

  }

  addBooking() {
    console.log(this.additionalInfoForm.value);
    this.visitorService.addBooking(moment(this.selectedDate[0]).format('yyyy-MM-DD'), this.visitorForm.value,
      this.additionalInfoForm.value.additionalInformation, this.additionalInfoForm.value.needsParkingSpace)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(
        next => {
          this.dialogHelper.showSuccessDialog({
            title: 'Buchung erfolgreich',
            message: 'Der Besucher wurde erfolgreich angemeldet.'
          }).afterClosed().subscribe(async () => {
            await this.navigation.go(Navigation.VISITORS);
          });
        }, error => {
        console.error(error);
        if (error.code === 409) {
          this.dialogHelper.showErrorDialog({
            title: 'Datum ausgebucht',
            message: 'Leider kann in diesem Datum kein weiterer Gast hinzugefügt werden.'
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  private _filter(value: string): Visitor[] {
    const filterValue = value.toLowerCase();

    return this.visitors.filter(option => option.Email.includes(filterValue));
  }

}
