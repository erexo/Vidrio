import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { State } from '@ngxs/store';
import { Computed, DataAction, Payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { SensorType } from '../enums/data/sensor-type.enum';

export interface LocalModel {
  accessToken: string;
  apiKey: string;
  sensorType: SensorType;
}

@Persistence()
@StateRepository()
@State({
  name: 'local',
  defaults: {
    accessToken: null,
    apiKey: null,
    sensorType: SensorType.Temperature
  }
})

@Injectable()
export class LocalState extends NgxsDataRepository<LocalModel> {
  constructor() {
    super();
  }

  @Computed()
  public get userAccessHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.snapshot.accessToken}`
    });
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
}