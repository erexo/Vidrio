import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild } from '@angular/router';

import { NavController } from '@ionic/angular';

import { LocalState } from '@core/states/local.state';

import { SensorType } from '@core/enums/data/sensor-type.enum';
import { UserRole } from '@core/enums/user/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private localState: LocalState,
    private navController: NavController
  ) { }

  canActivate(): boolean {
    if (!this.localState.accessToken) {
      this.navController.navigateRoot(['login']);
      return false;
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    const sensorPath: SensorType | string = childRoute.routeConfig.path;
    const userRole: UserRole = this.localState.userRole;
    let canActivateChild = false;

    switch (userRole) {
      case UserRole.Guest:
        canActivateChild = sensorPath === SensorType.Temperature || sensorPath === '';
        break;
      case UserRole.User:
        canActivateChild = sensorPath !== 'settings';
        break;
      default:
        canActivateChild = true;
        break;
    }

    return canActivateChild;
  }
}
