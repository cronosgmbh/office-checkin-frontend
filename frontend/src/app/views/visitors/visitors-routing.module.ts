import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VisitorsViewComponent} from './visitors-view/visitors-view.component';
import {AddVisitorViewComponent} from './add-visitor-view/add-visitor-view.component';
import {BookVisitorViewComponent} from './book-visitor-view/book-visitor-view.component';


const routes: Routes = [
  {
    path: '',
    component: VisitorsViewComponent,
  },
  {
    path: 'add',
    component: AddVisitorViewComponent
  },
  {path: 'book',
  component: BookVisitorViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorsRoutingModule {
}
