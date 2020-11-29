import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LocalState } from '@app/core/states/local.state';

import { ILoginInfo } from '@core/interfaces/login/login-info.interface';
import { ILoginUser } from '@core/interfaces/login/login-user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private localState: LocalState
  ) { }

  public login(user: ILoginUser): Observable<HttpResponse<ILoginInfo>> {
    return <Observable<HttpResponse<ILoginInfo>>>
      this.httpClient.post(`${this.localState.apiKey}/login`, user, { observe: 'response' });
  }
}
