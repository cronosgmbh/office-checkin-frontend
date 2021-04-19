import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BacktracingViewComponent } from './backtracing-view/backtracing-view.component';
import {CovidBacktracingRoutingModule} from './covid-backtracing-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [BacktracingViewComponent],
  imports: [
    CommonModule,
    CovidBacktracingRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class CovidBacktracingModule { }
