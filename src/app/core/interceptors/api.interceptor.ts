import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LocalState } from '@core/states/local.state';
import { Injectable } from '@angular/core';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(private localState: LocalState) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ url: `${this.localState.apiKey}${req.url}` });
    return next.handle(req);
  }
}