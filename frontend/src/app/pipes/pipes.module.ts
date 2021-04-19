import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocalizedDatePipe} from './localized-date/localized-date.pipe';
import { WeekdayPipe } from './weekday.pipe';

@NgModule({
  declarations: [
    LocalizedDatePipe,
    WeekdayPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LocalizedDatePipe,
    WeekdayPipe,
  ],
})
export class PipesModule {
}
