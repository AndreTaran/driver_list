import { Injectable } from '@angular/core';
import {Zip, zipData} from "../models/zip";
import {forkJoin, zip} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

import * as codes from '../zip_codes.json';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor(private http: HttpClient) { }

  postZipCodes() {
    // console.log(codes, 'codes')
    let res = this.generateZipData([...Object.values(codes)]);
    this.http.post(`${environment.fbURL}/zip_distance.json`, res)
      .subscribe(res => {
        console.log(res, 'fb')
      })

  }

  getZipCodes() {
    return this.http.get(`${environment.fbURL}/zip_distance.json`);
  }

  getZipCodeById(id: string) {
    return this.http.get(`${environment.fbURL}/zip_distance/-MhmtevwIOXiL4IvEFGE/${id}.json`);
  }

  zipList: Zip[] = [
    {zip: 123, latitude: 43, longitude: 34},
    {zip: 124, latitude: 41, longitude: 21},
    {zip: 125, latitude: 10, longitude: 50},
    {zip: 126, latitude: 50, longitude: 10},
  ];

  generateZipData(zipList: Zip[]) {
    console.log(zipList, 'data')
    let result: zipData = {};
    const length = zipList.length;
    zipList.forEach(zip => result[zip.zip] = {});

    for (let i = 0; i < length-1; i++) {
      let zip1 = zipList[i];
      // result[zip1.zip][zip1.zip] = 0;
      for (let j = i+1; j < length; j++) {
        let zip2 = zipList[j];
        let distance = this.calculateDistance(zip1, zip2);
        result[zip1.zip][zip2.zip] = distance;
        result[zip2.zip][zip1.zip] = distance;
        result[zip2.zip][zip2.zip] = 0;

      }
    }
    // result[zipList[length-1].zip][zipList[length-1].zip] = 0;
    console.log(result, 'dict')
    return result;
  }

  calculateDistance(zip1: Zip, zip2: Zip): number {
    const R = 6371;
    let cosD = Math.sin(zip1.latitude) * Math.sin(zip2.latitude) +
      Math.cos(zip1.latitude) * Math.cos(zip2.latitude) * Math.cos(zip1.longitude - zip1.longitude);

    return Math.acos(cosD) * R;
  }

  readFile(fileInput: any) {
    let file = fileInput.nativeElement.files[0];
    console.log(file)
    let fr = new FileReader();
    fr.readAsText(file);
    fr.onload = () => {
      console.log(fr.result, 'resfile')
      return this.convertData(fr.result);
    }

  }

  convertData(data: string | ArrayBuffer | null): Zip[] {
    let res: Zip[] = [];
    if (typeof data === 'string') {
      data?.split('\r\n').forEach(row => {
        let splitRow = row.split(',')
        res.push({zip: +splitRow[0], latitude: +splitRow[1], longitude: +splitRow[2]})
      });
    }

    return res;
  }
}
