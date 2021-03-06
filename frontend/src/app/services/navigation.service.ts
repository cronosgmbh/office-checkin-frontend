import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

export enum Navigation {
  ROOT = '',
  BOOKINGS = '/app/bookings',
  BOOKINGS_ADD = '/app/bookings/add',
  BOOKINGS_DONE = '/app/bookings/done',
  BOOKINGS_ADMIN = '/app/bookings/overview',

  COVID_BACKTRACING = '/app/covid-backtracing',

  AREAS = '/app/areas',
  AREAS_ADD = '/app/areas/add',
  AREAS_EDIT = '/app/areas/edit',
  AREAS_INVITE = '/app/areas/invite',

  USER_PROFILE = '/app/profile',

  LOGIN = '/login',
  SIGNUP = '/signup',
  SIGNUP_MEMBER = '/signup/member',
  SIGNUP_MANAGER = '/signup/manager',
  PASSWORD_RESET = '/password-reset',
  AREAS_JOIN = '/join',

  VISITORS = '/app/visitors',
  VISITORS_ADD = '/app/visitors/add',
  VISITORS_BOOK = '/app/visitors/book',

}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  constructor(
    private router: Router,
  ) {
  }

  async go(route: Navigation | string, path?: string[]): Promise<boolean> {
    const gotoRoute = path ? path.unshift(route) && path.join('/') : route;
    return this.router.navigate([gotoRoute]);
  }
}
