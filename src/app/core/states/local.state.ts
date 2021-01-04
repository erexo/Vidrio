import { Injectable } from '@angular/core';

import { State } from '@ngxs/store';
import { Computed, DataAction, Payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { SensorType } from '../enums/data/sensor-type.enum';
import { User } from '../models/user/user.model';
import { UserRole } from '../enums/user/user-role.enum';
import { ILoginUser } from '../interfaces/login/login-user.interface';
import { Observable, of } from 'rxjs';
import { HTTPStatusCode } from '../enums/http/http-status-code.enum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ILoginInfo } from '../interfaces/login/login-info.interface';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { NavController } from '@ionic/angular';

export interface LocalModel {
  accessToken: string;
  apiKey: string;
  sensorType: SensorType;
  user: User;
}

@Persistence()
@StateRepository()
@State({
  name: 'local',
  defaults: {
    accessToken: null,
    apiKey: null,
    sensorType: SensorType.Temperature,
    user: null
  }
})

@Injectable()
export class LocalState extends NgxsDataRepository<LocalModel> {
  constructor(
    private navController: NavController,
    private userService: UserService
  ) {
    super();
  }

  @Computed()
  public get accessToken(): string {
    return this.snapshot.accessToken;
  }

  @Computed()
  public get apiKey(): string {
    return this.snapshot.apiKey;
  }

  @Computed()
  public get sensorType(): SensorType {
    return this.snapshot.sensorType;
  }

  @Computed()
  public get userRole(): UserRole {
    return this.snapshot.user.role;
  } 

  @Computed()
  public get isAdmin(): boolean {
    return this.snapshot.user.role === UserRole.Admin;
  }

  @DataAction()
  setAccessToken(@Payload('accessToken') accessToken: string): void {
    this.ctx.patchState({
      accessToken
    });
  }

  @DataAction()
  setApiKey(@Payload('apiKey') apiKey: string): void {
    this.ctx.patchState({
      apiKey
    });
  }

  @DataAction()
  setSensorType(@Payload('sensorType') sensorType: SensorType): void {
    this.ctx.patchState({
      sensorType
    });
  }

  @DataAction()
  logout(): void {
    this.ctx.patchState({
      accessToken: null,
      user: null
    });
    
    this.navController.navigateBack('login');
  }
  
  public login(user: ILoginUser): Observable<HTTPStatusCode> {
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
}