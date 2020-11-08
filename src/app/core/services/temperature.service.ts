import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UserState } from '../states/user.state';

import { Thermometer } from '../models/temperature/thermometer.model';

import { apiUrl } from '@core/config/config.json';
import { ThermometerInfo } from '../models/temperature/thermometer-info.model';
import { HTTPStatusCode } from '../enums/http/http-status-code.enum';
import { ThermometerData } from '../models/temperature/thermometer-data.model';
import { IThermometerData } from '../interfaces/temperature/thermometer-data.interface';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  constructor(
    private httpClient: HttpClient,
    private userState: UserState
  ) {}

  public fetchThermometers(): Observable<HttpResponse<Thermometer[]>> {
    return <Observable<HttpResponse<Thermometer[]>>>
      this.httpClient.post(`${apiUrl}/thermal/browse`, {}, {
        headers: this.userState.userAccessHeaders,
        observe: 'response'
      });
  }

  public createThermometer(info: ThermometerInfo): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiUrl}/thermal/create`, info, {
        headers: this.userState.userAccessHeaders,
        observe: 'response'
      });
  }

  public updateThermometer(thermometer: Thermometer): Observable<HttpResponse<HTTPStatusCode>> {
    const { id, name, sensor } = thermometer;

    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`${apiUrl}/thermal/update/${id}`, { name, sensor }, {
        headers: this.userState.userAccessHeaders,
        observe: 'response'
      });
  }

  public getThermometersData(data: ThermometerData): Observable<HttpResponse<IThermometerData[]>> {
    return <Observable<HttpResponse<IThermometerData[]>>>
      this.httpClient.post(`${apiUrl}/thermal/data`, data, {
        headers: this.userState.userAccessHeaders,
        observe: 'response'
      });
  }

  public changeThermometersOrder(ids: number[]): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${apiUrl}/thermal/order`, ids, {
        headers: this.userState.userAccessHeaders,
        observe: 'response'
      });
  }

  public deleteThermometer(id: number): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.delete(`${apiUrl}/thermal/delete/${id}`, {
        headers: this.userState.userAccessHeaders,
        observe: 'response'
      });
  }
}
