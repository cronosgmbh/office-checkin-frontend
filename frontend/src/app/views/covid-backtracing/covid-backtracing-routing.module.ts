import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BacktracingViewComponent} from './backtracing-view/backtracing-view.component';


const routes: Routes = [
  {
    path: '',
    component: BacktracingViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidBacktracingRoutingModule {
}
