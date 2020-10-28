import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LoginInfo } from '@core/interfaces/login/login-info.interface';
import { LoginUser } from '@core/interfaces/login/login-user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl: string = 'http://149.202.86.49:4235';

  constructor(private httpClient: HttpClient) { }

  public login(user: LoginUser): Observable<HttpResponse<LoginInfo>> {
    return <Observable<HttpResponse<LoginInfo>>>
      this.httpClient.post(`${this.apiUrl}/login`, user, { observe: 'response' });
  }
}
