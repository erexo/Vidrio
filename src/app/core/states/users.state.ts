import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';

import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

import { UserService } from '@core/services/user.service';

import { IUserInfo } from '@core/interfaces/user/user-info.interface';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';
import { UserRole } from '@core/enums/user/user-role.enum';

import { APIResponse } from '@core/models/http/api-response.model';
import { User } from '@core/models/user/user.model';

export interface UsersModel {
  users: IUserInfo[];
}

@StateRepository()
@State({
  name: 'users',
  defaults: {
    users: []
  }
})

@Injectable()
export class UsersState extends NgxsDataRepository<UsersModel> {
  constructor(private userService: UserService) {
    super();
  }

  public fetchUsers(): Observable<APIResponse<IUserInfo[]>> {
    return this.userService.fetchUsers().pipe(
      filter((res: HttpResponse<IUserInfo[]>) => !!res.body),
      tap((res: HttpResponse<IUserInfo[]>) => {
        this.patchState({
          users: res.body
        });
      }),
      map((res: HttpResponse<IUserInfo[]>) => new APIResponse(res.body, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public createUser(user: User): Observable<APIResponse<void>> {
    return this.userService.createUser(user).pipe(
      tap(_ => this.fetchUsers()),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public updateUserPassword(userID: number, password: string): Observable<APIResponse<void>> {
    return this.userService.updateUserPassword(userID, password).pipe(
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public updateUserRole(userID: number, role: UserRole): Observable<APIResponse<void>> {
    return this.userService.updateUserRole(userID, role).pipe(
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public deleteUser(userID: number): Observable<APIResponse<void>> {
    return this.userService.deleteUser(userID).pipe(
      tap(_ => this.fetchUsers()),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }
}