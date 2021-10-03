import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Driver} from "../models/driver";
import {environment} from "../../../environments/environment";
import {FormArray} from "@angular/forms";
import {map} from "rxjs/operators";

import * as drivers from '../drivers.json';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${environment.fbURL}/drivers.json`);
  }

  getAllAvailable(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${environment.fbURL}/drivers.json?orderBy="driverStatus"&equalTo="available"`);
  }

  getById(driver: Driver): Observable<Driver> {
    return this.http.get<Driver>(`${environment.fbURL}/drivers/${driver?.id}.json`)
  }

  getAllAsFormArray(): Observable<FormArray> {
    return this.getAll().pipe(
      map((drivers) => {
        drivers = [...Object.values(drivers)];
        const fgs = drivers.map(driver => Driver.asFormGroup(driver));
        return new FormArray(fgs);
      })
    )
  }

  updateData(driver: Driver) {
    return this.http.patch(`${environment.fbURL}/drivers/${driver.id}.json`, driver)
      .subscribe(res => console.log())
  }

  getFakeData() {
    return this.http.get(`${environment.fbURL}/drivers.json`);
  }

  addDriver(id: string, form: {}) {
    return this.http.patch(`${environment.fbURL}/drivers/${id}.json`, form);
  }

  getLastDriver() {
    return this.http.get(`${environment.fbURL}/drivers.json?orderBy="$key"&limitToLast=1`)
  }
}
