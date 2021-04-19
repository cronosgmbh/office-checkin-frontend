import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptViewComponent } from './accept-view/accept-view.component';
import {SharedModule} from '../../shared/shared.module';
import {InvitationRoutingModule} from './invitation-routing.module';



@NgModule({
  declarations: [AcceptViewComponent],
    imports: [
        CommonModule,
        SharedModule,
      InvitationRoutingModule
    ],
})
export class InvitationModule { }
