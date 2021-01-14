import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';

import { SensorType } from '@core/enums/data/sensor/sensor-type.enum';

@Injectable({
  providedIn: 'root'
})
export class SensorGuardService implements CanActivateChild {

  constructor() { }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    const sensorPath: SensorType = <SensorType>childRoute.routeConfig.path;
    return sensorPath === SensorType.Temperature;
  }
}
