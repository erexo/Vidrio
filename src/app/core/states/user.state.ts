import { Injectable } from '@angular/core';

import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';

import { UserService } from '@core/services/user.service';

import { LoginUser } from '@core/interfaces/login/login-user.interface';
import { User } from '@core/models/user/user.model';
import { UserRole } from '@core/enums/user/user-role.enum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoginInfo } from '../interfaces/login/login-info.interface';
import { Observable, of } from 'rxjs';

export interface UserModel {
  accessToken: string;
  user: User;
}

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
  public get userRole(): UserRole {
    return this.snapshot.user.role;
  }

  @DataAction()
  login(user: LoginUser): Observable<number> {
    return this.userService.login(user).pipe(
      filter((res: HttpResponse<LoginInfo>) => !!res.body),
      tap((res: HttpResponse<LoginInfo>) => {
        this.ctx.setState({
          accessToken: res.body.accessToken,
          user: new User(user.password, res.body.role, user.username)
        })
      }),
      map((res: HttpResponse<LoginInfo>) => res.status),
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }
}