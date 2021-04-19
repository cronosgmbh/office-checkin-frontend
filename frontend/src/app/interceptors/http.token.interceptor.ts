import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest, HttpResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      Authorization: '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = localStorage.getItem('idToken');

    if (token) {
      headersConfig.Authorization = `Token ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request)
      .pipe(catchError((err) => {
        return throwError(err);
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
        }
        return evt;
      }));
  }
}
