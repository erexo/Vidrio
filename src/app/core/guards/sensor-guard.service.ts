import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SensorType } from '../enums/data/sensor-type.enum';
import { LocalState } from '../states/local.state';

@Injectable({
  providedIn: 'root'
})
export class SensorGuardService implements CanActivateChild {

  constructor(
    private localState: LocalState,
    private navController: NavController
  ) { }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    const sensorPath: SensorType = <SensorType>childRoute.routeConfig.path;
    console.log(sensorPath, sensorPath === SensorType.Temperature);

    if (sensorPath === SensorType.Temperature) {
      return true;
    }
    return false;
  }
}
