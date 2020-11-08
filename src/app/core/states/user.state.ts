import { Injectable } from '@angular/core';

import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Computed, DataAction, Persistence, StateRepository } from '@ngxs-labs/data/decorators';

import { UserService } from '@core/services/user.service';

import { ILoginUser } from '@core/interfaces/login/login-user.interface';
import { User } from '@core/models/user/user.model';
import { UserRole } from '@core/enums/user/user-role.enum';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ILoginInfo } from '../interfaces/login/login-info.interface';
import { Observable, of } from 'rxjs';
import { HTTPStatusCode } from '../enums/http/http-status-code.enum';

export interface UserModel {
  accessToken: string;
  user: User;
}

@Persistence()
@StateRepository()
@State({
  name: 'user',
  defaults: {
    accessToken: null,
    user: null
  }
})

@Injectable()
export class UserState extends NgxsDataRepository<UserModel> {
  constructor(private userService: UserService) {
    super();
  }

  @Computed()
  public get userAccessHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.snapshot.accessToken}`
    });
  }

  @Computed()
  public get userRole(): UserRole {
    return this.snapshot.user.role;
  } 

  login(user: ILoginUser): Observable<HTTPStatusCode> {
    return this.userService.login(user).pipe(
      filter((res: HttpResponse<ILoginInfo>) => !!res.body),
      tap((res: HttpResponse<ILoginInfo>) => {
        this.patchState({
          accessToken: res.body.accessToken,
          user: new User(user.password, res.body.role, user.username)
        })
      }),
      map((res: HttpResponse<ILoginInfo>) => res.status),
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }

  @DataAction()
  logout(): void {
    this.reset();
  }
}