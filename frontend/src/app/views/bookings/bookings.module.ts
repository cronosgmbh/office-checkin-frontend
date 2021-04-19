import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { AddBookingViewComponent } from './add-booking-view/add-booking-view.component';
import { BookingsViewComponent } from './bookings-view/bookings-view.component';
import { PostBookingInfoViewComponent } from './post-booking-info-view/post-booking-info-view.component';
import { SharedModule } from '../../shared/shared.module';
import { BookingSuccessfulDialogContentComponent } from './booking-successful-dialog-content/booking-successful-dialog-content.component';
import { BookingsOverviewComponent } from './bookings-overview/bookings-overview.component';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {BookingFailedDialogContentComponent} from './booking-failed-dialog-content/booking-failed-dialog-content.component';

@NgModule({
  declarations: [
    AddBookingViewComponent,
    BookingsViewComponent,
    PostBookingInfoViewComponent,
    BookingSuccessfulDialogContentComponent,
    BookingFailedDialogContentComponent,
    BookingsOverviewComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    SharedModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
  ]
})
export class BookingsModule {
}
