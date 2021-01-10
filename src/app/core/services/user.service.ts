import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ILoginInfo } from '@core/interfaces/login/login-info.interface';
import { ILoginUser } from '@core/interfaces/login/login-user.interface';
import { UserRole } from '../enums/user/user-role.enum';
import { HTTPStatusCode } from '../enums/http/http-status-code.enum';
import { IUserInfo } from '../interfaces/user/user-info.interface';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public login(user: ILoginUser): Observable<HttpResponse<ILoginInfo>> {
    return <Observable<HttpResponse<ILoginInfo>>>
      this.httpClient.post(`/login`, user, {
        observe: 'response'
      });
  }

  public fetchUsers(): Observable<HttpResponse<IUserInfo[]>> {
    return <Observable<HttpResponse<IUserInfo[]>>>
      this.httpClient.post(`/user/browse`, {}, {
        observe: 'response'
      });
  }

  public createUser(user: User): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`/user/create`, user, {
        observe: 'response'
      });
  }

  public updateUserPassword(userID: number, password: string): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`/user/update/password/${userID}`, { password }, {
        observe: 'response'
      });
  }

  public updateUserRole(userID: number, role: UserRole): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`/user/update/role/${userID}`, { role }, {
        observe: 'response'
      });
  }

  public deleteUser(userID: number): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.delete(`/user/delete/${userID}`, {
        observe: 'response'
      });
  }
}
