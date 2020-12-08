import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LocalState } from '@app/core/states/local.state';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';

import { IThermometerData } from '@core/interfaces/temperature/thermometer-data.interface';

import { ThermometerData } from '@core/models/temperature/thermometer-data.model';
import { SensorInfo } from '@app/core/models/sensor/sensor-info.model';
import { Sensor } from '@core/models/sensor/sensor.model';
import { SensorToggleDirection } from '../enums/data/sensor-toggle-direction.enum';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  constructor(
    private httpClient: HttpClient,
    private localState: LocalState
  ) {}

  public fetchSensors(): Observable<HttpResponse<Sensor[]>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<Sensor[]>>>
      this.httpClient.post(`${apiKey}/${sensorType}/browse`, {}, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  public createSensor(info: any): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiKey}/${sensorType}/create`, info, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  public updateSensor(sensor: Sensor): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;
    const { id } = sensor;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`${apiKey}/${sensorType}/update/${id}`, sensor, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  public changeSensorsOrder(sensorIDs: number[]): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiKey}/${sensorType}/order`, sensorIDs, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  public deleteSensor(sensorID: number): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.delete(`${apiKey}/${sensorType}/delete/${sensorID}`, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  // Custom endpoints
  public fetchThermometerData(data: ThermometerData): Observable<HttpResponse<IThermometerData[]>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<IThermometerData[]>>>
      this.httpClient.post(`${apiKey}/${sensorType}/data`, data, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  public toggleSunblind(sensorID: number, sensorToggleDirection: SensorToggleDirection): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiKey}/${sensorType}/toggle/${sensorID}/${sensorToggleDirection}`, null, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }

  public toggleLight(sensorID: number): Observable<HttpResponse<HTTPStatusCode>> {
    const { apiKey, sensorType, userAccessHeaders } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiKey}/${sensorType}/toggle/${sensorID}`, null, {
        headers: userAccessHeaders,
        observe: 'response'
      });
  }
}
