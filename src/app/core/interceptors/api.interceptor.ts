import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LocalState } from '@core/states/local.state';

import { environment } from 'src/environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(
    private platform: Platform,
    private localState: LocalState
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { hostname, port } = window.location;
    const { accessToken, apiKey } = this.localState;

    const apiUrl: string = this.platform.is("android") || this.platform.is("ios") || !environment.production
      ? `http://${apiKey}/api${request.url}`
      : `http://${hostname}:${port}/api${request.url}`;

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      url: apiUrl
    });

    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 401) {
          this.localState.logout();
        }
        return throwError(response);
      })
    );
  }
}