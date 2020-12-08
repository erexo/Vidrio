import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Computed, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

import { SensorService } from '@app/core/services/sensor.service';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';

import { APIResponse } from '@core/models/http/api-response.model';
import { SensorInfo } from '@app/core/models/sensor/sensor-info.model';
import { Sensor } from '../models/sensor/sensor.model';
import { SensorToggleDirection } from '../enums/data/sensor-toggle-direction.enum';

export interface DataModel {
  sensors: any[];
}

@StateRepository()
@State({
  name: 'data',
  defaults: {
    sensors: []
  }
})

@Injectable()
export class DataState extends NgxsDataRepository<DataModel> {
  constructor(private sensorService: SensorService) {
    super();
  }

  @Computed()
  public get sensors(): Sensor[] {
    return this.snapshot.sensors;
  }

  public fetchSensors(): Observable<APIResponse<Sensor[]>> {
    return this.sensorService.fetchSensors().pipe(
      filter((res: HttpResponse<Sensor[]>) => !!res.body),
      tap((res: HttpResponse<Sensor[]>) => {
        this.patchState({
          sensors: res.body
        });
      }),
      map((res: HttpResponse<Sensor[]>) => new APIResponse(res.body, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public createSensor(sensorInfo: any): Observable<APIResponse<void>> {
    return this.sensorService.createSensor(sensorInfo).pipe(
      tap(_ => this.fetchSensors()),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public updateSensor(updatedSensor: Sensor): Observable<APIResponse<void>> {
    return this.sensorService.updateSensor(updatedSensor).pipe(
      tap(_ => {
        this.setState(
          patch({
            sensors: updateItem<Sensor>(sensor => sensor.id === updatedSensor.id, updatedSensor)
          })
        );
      }),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public deleteSensor(id: number): Observable<APIResponse<void>> {
    return this.sensorService.deleteSensor(id).pipe(
      tap(_ => {
        this.setState(
          patch({
            sensors: removeItem<Sensor>(sensor => sensor.id === id)
          })
        );
      }),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public changeSensorsOrder(sensorIDs: number[]): Observable<APIResponse<void>> {
    return this.sensorService.changeSensorsOrder(sensorIDs).pipe(
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public toggleSunblind(sensorID: number, sensorToggleDirection: SensorToggleDirection): Observable<APIResponse<void>> {
    return this.sensorService.toggleSunblind(sensorID, sensorToggleDirection).pipe(
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public toggleLight(sensorID: number): Observable<APIResponse<void>> {
    return this.sensorService.toggleLight(sensorID).pipe(
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }
}