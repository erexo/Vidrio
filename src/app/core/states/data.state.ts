import { Injectable } from '@angular/core';

import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Thermometer } from '../models/temperature/thermometer.model';
import { TemperatureService } from '../services/temperature.service';
import { APIResponse } from '../models/http/api-response.model';
import { ThermometerInfo } from '../models/temperature/thermometer-info.model';
import { HTTPStatusCode } from '../enums/http/http-status-code.enum';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ThermometerData } from '../models/temperature/thermometer-data.model';
import { IThermometerData } from '../interfaces/temperature/thermometer-data.interface';

export interface DataModel {
  thermometers: Thermometer[];
  itemMenu: string; 
}

@StateRepository()
@State({
  name: 'data',
  defaults: {
    thermometers: [],
    itemMenu: null
  }
})

@Injectable()
export class DataState extends NgxsDataRepository<DataModel> {
  constructor(private temperatureService: TemperatureService) {
    super();
  }

  @Computed()
  public get thermometers(): Thermometer[] {
    return this.snapshot.thermometers;
  }

  public fetchThermometers(): Observable<APIResponse<Thermometer[]>> {
    return this.temperatureService.fetchThermometers().pipe(
      filter((res: HttpResponse<Thermometer[]>) => !!res.body),
      tap((res: HttpResponse<Thermometer[]>) => {
        this.patchState({
          thermometers: res.body
        });
      }),
      map((res: HttpResponse<Thermometer[]>) => new APIResponse(res.body, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public createThermometer(info: ThermometerInfo): Observable<APIResponse<void>> {
    return this.temperatureService.createThermometer(info).pipe(
      tap(_ => this.fetchThermometers()),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public updateThermometer(updatedThermometer: Thermometer): Observable<APIResponse<void>> {
    return this.temperatureService.updateThermometer(updatedThermometer).pipe(
      tap(_ => {
        this.setState(
          patch({
            thermometers: updateItem<Thermometer>(thermometer => thermometer.id === updatedThermometer.id, updatedThermometer)
          })
        );
      }),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public deleteThermometer(id: number): Observable<APIResponse<void>> {
    return this.temperatureService.deleteThermometer(id).pipe(
      tap(_ => {
        this.setState(
          patch({
            thermometers: removeItem<Thermometer>(thermometer => thermometer.id === id)
          })
        );
      }),
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public changeThermometersOrder(ids: number[]): Observable<APIResponse<void>> {
    return this.temperatureService.changeThermometersOrder(ids).pipe(
      map((res: HttpResponse<HTTPStatusCode>) => new APIResponse(null, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  @DataAction()
  getThermometersData(data: ThermometerData): Observable<APIResponse<IThermometerData[]>> {
    return this.temperatureService.getThermometersData(data).pipe(
      map((res: HttpResponse<IThermometerData[]>) => new APIResponse(res.body, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  @DataAction()
  itemMenuOpened(pageName: string): void {
    this.ctx.patchState({
      itemMenu: pageName
    });
  }
}