import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiState } from '@app/core/states/local.state';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';

import { Blind } from '../models/blind/blind.model';

@Injectable({
  providedIn: 'root'
})
export class BlindService {
  constructor(
    private apiState: ApiState,
    private httpClient: HttpClient
  ) {}

  public fetchBlinds(): Observable<HttpResponse<Blind[]>> {
    return <Observable<HttpResponse<Blind[]>>>
      this.httpClient.post(`${this.apiState.apiKey}/sunblind/browse`, {}, {
        headers: this.apiState.userAccessHeaders,
        observe: 'response'
      });
  }

  public createBlind(blind: Blind): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${this.apiState.apiKey}/sunblind/create`, blind, {
        headers: this.apiState.userAccessHeaders,
        observe: 'response'
      });
  }

  public updateBlind(blind: Blind, id: number): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.patch(`${this.apiState.apiKey}/sunblind/update/${id}`, blind, {
        headers: this.apiState.userAccessHeaders,
        observe: 'response'
      });
  }

  public toggleBlind(id: number, direction: string): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${this.apiState.apiKey}/sunblind/toggle/${id}/${direction}`, {
        headers: this.apiState.userAccessHeaders,
        observe: 'response'
      });
  }

  public changeBlindsOrder(ids: number[]): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.post(`${this.apiState.apiKey}/sunblind/order`, ids, {
        headers: this.apiState.userAccessHeaders,
        observe: 'response'
      });
  }

  public deleteBlind(id: number): Observable<HttpResponse<HTTPStatusCode>> {
    return <Observable<HttpResponse<HTTPStatusCode>>>
      this.httpClient.delete(`${this.apiState.apiKey}/sunblind/delete/${id}`, {
        headers: this.apiState.userAccessHeaders,
        observe: 'response'
      });
  }
}
