import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LocalState } from '@app/core/states/local.state';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';

import { IThermometerData } from '@core/interfaces/temperature/thermometer-data.interface';

import { ThermometerData } from '@core/models/temperature/thermometer-data.model';
import { SensorInfo } from '@app/core/models/sensor/sensor-info.model';
import { Sensor } from '@core/models/sensor/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  constructor(
    private httpClient: HttpClient,
    private localState: LocalState
  ) {}

  public fetchSensors(): Observable<HttpResponse<Sensor[]>> {
    const { apiKey, sensorType } = this.localState;

    return <Observable<HttpResponse<Sensor[]>>>
      this.httpClient.post(`${apiKey}/${sensorType}/browse`, {}, {
        headers: this.localState.userAccessHeaders,
        observe: 'response'
      });
  }

  public createSensor(info: SensorInfo): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiKey}/${sensorType}/create`, info, {
        headers: this.localState.userAccessHeaders,
        observe: 'response'
      });
  }

  public updateSensor(sensor: Sensor): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType } = this.localState;
    const { id } = sensor;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`${apiKey}/${sensorType}/update/${id}`, sensor, {
        headers: this.localState.userAccessHeaders,
        observe: 'response'
      });
  }

  public changeSensorsOrder(sensorIDs: number[]): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiKey}/${sensorType}/order`, sensorIDs, {
        headers: this.localState.userAccessHeaders,
        observe: 'response'
      });
  }

  public deleteSensor(sensorID: number): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.delete(`${apiKey}/${sensorType}/delete/${sensorID}`, {
        headers: this.localState.userAccessHeaders,
        observe: 'response'
      });
  }

  // Custom endpoints

  public fetchThermometerData(data: ThermometerData): Observable<HttpResponse<IThermometerData[]>> {
    const { apiKey, sensorType } = this.localState;

    return <Observable<HttpResponse<IThermometerData[]>>>
      this.httpClient.post(`${apiKey}/${sensorType}/data`, data, {
        headers: this.localState.userAccessHeaders,
        observe: 'response'
      });
  }
}
