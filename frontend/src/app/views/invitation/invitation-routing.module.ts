import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AcceptViewComponent} from './accept-view/accept-view.component';
import {LoginSidebarComponent} from '../../components/sidebar/login-sidebar/login-sidebar.component';


const routes: Routes = [
  {
    path: '',
    component: LoginSidebarComponent,
    outlet: 'sidebar',
  },
  {
    path: ':id',
    component: AcceptViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitationRoutingModule {
}
