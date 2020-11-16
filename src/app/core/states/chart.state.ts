import { Injectable } from '@angular/core';

import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Computed, DataAction, Payload, StateRepository } from '@ngxs-labs/data/decorators';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TemperatureService } from '../services/temperature.service';
import { APIResponse } from '../models/http/api-response.model';
import { ThermometerData } from '../models/temperature/thermometer-data.model';
import { IThermometerData } from '../interfaces/temperature/thermometer-data.interface';
import { patch, append, updateItem, insertItem } from '@ngxs/store/operators';
import { getUnixTime, sub } from 'date-fns';
import { DataState } from './data.state';

export interface ChartModel {
  dateOffset: number;
  data: any[][];
  selectedID: number;
}

@StateRepository()
@State({
  name: 'chart',
  defaults: {
    dateOffset: 1,
    data: []
  }
})

@Injectable()
export class ChartState extends NgxsDataRepository<ChartModel> {
  constructor(private temperatureService: TemperatureService) {
    super();
  }

  @Computed()
  public get dateOffset(): number {
    return this.snapshot.dateOffset;
  }

  @Computed()
  public get selectedID(): number {
    return this.snapshot.selectedID;
  }

  public fetchThermometersData(id: number): Observable<APIResponse<IThermometerData[]>> {
    const startDate: number = getUnixTime(sub(new Date(), { days: this.dateOffset }));
    const endDate: number = getUnixTime(sub(new Date(), { days: this.dateOffset - 1 }));
    const data: ThermometerData = new ThermometerData(id, startDate, endDate);

    return this.temperatureService.fetchThermometersData(data).pipe(
      filter((res: HttpResponse<IThermometerData[]>) => !!res.body),
      tap((res: HttpResponse<IThermometerData[]>) => {
        this.setState(
          patch({
            data: insertItem(res.body, 0)
          })
        );
      }),
      map((res: HttpResponse<IThermometerData[]>) => new APIResponse(res.body, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public fetchData(pageName: string): Observable<APIResponse<any[]>> {
    let fetchedData$: Observable<APIResponse<any[]>>;

    switch (pageName) {
      case 'temperature':
        fetchedData$ = this.fetchThermometersData(this.selectedID);
        break;
    }

    return fetchedData$;
  }

  @DataAction()
  incrementChartDateOffset(): void {
    this.ctx.patchState({
      dateOffset: this.dateOffset + 1
    });
  }

  @DataAction()
  setSelectedID(@Payload('id') id: number): void {
    this.ctx.patchState({
      selectedID: id
    });
  }

  @DataAction()
  resetSelectedID(): void {
    this.ctx.patchState({
      selectedID: null
    });
  }
}