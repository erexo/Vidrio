import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { Computed, DataAction, Payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

import { UserService } from '@core/services/user.service';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';
import { UserRole } from '@core/enums/user/user-role.enum';

import { ILoginInfo } from '@core/interfaces/login/login-info.interface';
import { ILoginUser } from '@core/interfaces/login/login-user.interface';

import { User } from '@core/models/user/user.model';
import { LocalState } from './local.state';

export interface UserModel {
  user: User;
}

@Persistence()
@StateRepository()
@State({
  name: 'user',
  defaults: {
    user: null
  }
})

@Injectable()
export class UserState extends NgxsDataRepository<UserModel> {
  constructor(
    private localState: LocalState,
    private userService: UserService
  ) {
    super();
  }

  @Computed()
  public get userRole(): UserRole {
    return this.snapshot.user.role;
  } 

  public login(user: ILoginUser): Observable<HTTPStatusCode> {
    return this.userService.login(user).pipe(
      filter((res: HttpResponse<ILoginInfo>) => !!res.body),
      tap((res: HttpResponse<ILoginInfo>) => {
        this.localState.setAccessToken(res.body.accessToken);
        
        this.patchState({
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