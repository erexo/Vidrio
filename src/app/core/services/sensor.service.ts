import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LocalState } from '@core/states/local.state';

import { IThermometerData } from '@core/interfaces/temperature/thermometer-data.interface';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';
import { SensorToggleDirection } from '@core/enums/data/sensor/sensor-toggle-direction.enum';

import { ThermometerData } from '@core/models/temperature/thermometer-data.model';
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
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<Sensor[]>>>
      this.httpClient.post(`/${sensorType}/browse`, {}, {
        observe: 'response'
      });
  }

  public createSensor(info: any): Observable<HttpResponse<HTTPStatusCode>> {
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`/${sensorType}/create`, info, {
        observe: 'response'
      });
  }

  public updateSensor(sensor: Sensor): Observable<HttpResponse<HTTPStatusCode>> {
    const { sensorType } = this.localState;
    const { id } = sensor;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`/${sensorType}/update/${id}`, sensor, {
        observe: 'response'
      });
  }

  public changeSensorsOrder(sensorIDs: number[]): Observable<HttpResponse<HTTPStatusCode>> {
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`/${sensorType}/order`, sensorIDs, {
        observe: 'response'
      });
  }

  public deleteSensor(sensorID: number): Observable<HttpResponse<HTTPStatusCode>> {
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.delete(`/${sensorType}/delete/${sensorID}`, {
        observe: 'response'
      });
  }

  // Custom endpoints
  public fetchThermometerData(data: ThermometerData): Observable<HttpResponse<IThermometerData[]>> {
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<IThermometerData[]>>>
      this.httpClient.post(`/${sensorType}/data`, data, {
        observe: 'response'
      });
  }

  public toggleSunblind(sensorID: number, sensorToggleDirection: SensorToggleDirection): Observable<HttpResponse<HTTPStatusCode>> {
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`/${sensorType}/toggle/${sensorID}/${sensorToggleDirection}`, null, {
        observe: 'response'
      });
  }

  public toggleLight(sensorID: number): Observable<HttpResponse<HTTPStatusCode>> {
    const { sensorType } = this.localState;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`/${sensorType}/toggle/${sensorID}`, null, {
        observe: 'response'
      });
  }
}
