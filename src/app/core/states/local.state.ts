import { Injectable, NgZone } from '@angular/core';

import { State } from '@ngxs/store';
import { Computed, DataAction, Payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { SensorType } from '../enums/data/sensor/sensor-type.enum';
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
import { MenuItem } from '../models/menu/menu-item.model';

export interface LocalModel {
  accessToken: string;
  apiKey: string;
  menuItems: MenuItem[];
  activeMenu: MenuItem[];
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
    menuItems: [
      new MenuItem('thermal', 'Thermal', 'thermometer-outline'),
      new MenuItem('sunblind', 'Blinds', 'book-outline'),
      new MenuItem('light', 'Lights', 'sunny-outline'),
      new MenuItem('settings', 'Settings', 'settings-outline'),
      new MenuItem(undefined, 'Logout', 'log-out-outline', true)
    ],
    activeMenu: [],
    sensorType: SensorType.Temperature,
    user: null
  }
})

@Injectable()
export class LocalState extends NgxsDataRepository<LocalModel> {
  constructor(
    private navController: NavController,
    private userService: UserService,
    private zone: NgZone
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
  public get menuItems(): MenuItem[] {
    return this.snapshot.menuItems;
  }

  @Computed()
  public get activeMenu(): MenuItem[] {
    return this.snapshot.activeMenu;
  }

  @Computed()
  public get sensorType(): SensorType {
    return this.snapshot.sensorType;
  }

  @Computed()
  public get userRole(): UserRole {
    return this.snapshot.user?.role;
  } 

  @Computed()
  public get isAdmin(): boolean {
    return this.snapshot.user?.role === UserRole.Admin;
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
    
    this.zone.run(_ => this.navController.navigateBack('login'));
  }
  
  public login(user: ILoginUser): Observable<HTTPStatusCode> {
    return this.userService.login(user).pipe(
      filter((res: HttpResponse<ILoginInfo>) => !!res.body.accessToken),
      tap((res: HttpResponse<ILoginInfo>) => {
        this.patchState({
          accessToken: res.body.accessToken,
          activeMenu: this.getActiveMenu(res.body.role),
          user: new User(user.password, res.body.role, user.username)
        });
      }),
      map((res: HttpResponse<ILoginInfo>) => {
        return res.status;
      }),
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }

  private getActiveMenu(userRole: UserRole): MenuItem[] {
    const menuItems: MenuItem[] = [...this.menuItems];
    let activeMenu: MenuItem[]

    switch (userRole) {
      case UserRole.Guest:
        activeMenu = menuItems.filter(menuItem =>
          menuItem.tabName === SensorType.Temperature || menuItem.tabName === undefined);
        break;
      case UserRole.User:
        activeMenu = menuItems.filter(menuItem => menuItem.tabName !== 'settings');
        break;
      case UserRole.Admin:
        activeMenu = menuItems;
        break;
    }

    return activeMenu;
  }
}