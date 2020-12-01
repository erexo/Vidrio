import { Injectable } from '@angular/core';

import { catchError, filter, map, tap } from 'rxjs/operators';

import { State } from '@ngxs/store';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Computed, DataAction, Payload, StateRepository } from '@ngxs-labs/data/decorators';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SensorService } from '../services/sensor.service';
import { APIResponse } from '../models/http/api-response.model';
import { ThermometerData } from '../models/temperature/thermometer-data.model';
import { IThermometerData } from '../interfaces/temperature/thermometer-data.interface';
import { patch, insertItem } from '@ngxs/store/operators';
import { getUnixTime, sub } from 'date-fns';
import { SensorType } from '../enums/data/sensor-type.enum';

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
    data: [],
    selectedID: null
  }
})

@Injectable()
export class ChartState extends NgxsDataRepository<ChartModel> {
  constructor(private sensorService: SensorService) {
    super();
  }

  @Computed()
  public get data(): any[][] {
    return this.snapshot.data;
  }

  @Computed()
  public get sliceOfData(): any[] {
    return this.snapshot.data[this.dateOffset - 1];
  }

  @Computed()
  public get dataLength(): number {
    return this.snapshot.data.length;
  }

  @Computed()
  public get dateOffset(): number {
    return this.snapshot.dateOffset;
  }

  @Computed()
  public get selectedID(): number {
    return this.snapshot.selectedID;
  }

  public fetchThermometersData(): Observable<APIResponse<IThermometerData[]>> {
    const startDate: number = getUnixTime(sub(new Date(), { days: this.dateOffset }));
    const endDate: number = getUnixTime(sub(new Date(), { days: this.dateOffset - 1 }));
    const data: ThermometerData = new ThermometerData(this.selectedID, startDate, endDate);

    return this.sensorService.fetchThermometerData(data).pipe(
      filter((res: HttpResponse<IThermometerData[]>) => !!res.body),
      tap((res: HttpResponse<IThermometerData[]>) => {
        this.setState(
          patch({
            data: insertItem(res.body, this.dateOffset)
          })
        );
      }),
      map((res: HttpResponse<IThermometerData[]>) => new APIResponse(res.body, res.status)),
      catchError((err: HttpErrorResponse) => of(new APIResponse(null, err.status)))
    );
  }

  public fetchData(pageName: SensorType): Observable<APIResponse<any[]>> {
    let fetchedData$: Observable<APIResponse<any[]>>;

    switch (pageName) {
      case SensorType.Temperature:
        fetchedData$ = this.fetchThermometersData();
        break;
    }

    return fetchedData$;
  }

  @DataAction()
  decrementChartDateOffset(): void {
    this.ctx.patchState({
      dateOffset: this.dateOffset - 1
    });
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