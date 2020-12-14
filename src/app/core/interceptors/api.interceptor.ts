import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LocalState } from '@core/states/local.state';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(private localState: LocalState) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ url: `http://${this.localState.apiKey}/api${req.url}` });
    return next.handle(req);
  }
}