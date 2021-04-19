import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VisitorsRoutingModule} from './visitors-routing.module';
import { AddVisitorViewComponent } from './add-visitor-view/add-visitor-view.component';
import { VisitorsViewComponent } from './visitors-view/visitors-view.component';
import {SharedModule} from '../../shared/shared.module';
import { BookVisitorViewComponent } from './book-visitor-view/book-visitor-view.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [AddVisitorViewComponent, VisitorsViewComponent, BookVisitorViewComponent],
  imports: [
    CommonModule,
    VisitorsRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class VisitorsModule { }
