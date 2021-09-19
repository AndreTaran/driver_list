import {Injectable} from '@angular/core';
import {Zip, zipData} from "../models/zip";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Driver, DriverDistance} from "../models/driver";

export interface zipCode {
  [id: string]: {latitude: string, longitude: string, zip: string}
}

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  // @ts-ignore
  driversDistances$: BehaviorSubject<Driver[]> = new BehaviorSubject<Driver[]>(null);
  // @ts-ignore
  searchZip$: BehaviorSubject<zipCode> = new BehaviorSubject<zipCode>(null);

  constructor(private http: HttpClient,
              private afs: AngularFirestore,
              private db: AngularFireDatabase,
              private  fs: AngularFireStorage) {
  }

  // postZipCodes() {
  //   // console.log(codes, 'codes')
  //   let res = this.generateZipData([...Object.values(codes)]);
  //   this.http.post(`${environment.fbURL}/zip_distance.json`, res)
  //     .subscribe(res => {
  //       console.log(res, 'fb')
  //     })
  //
  // }

  getZipCodes() {
    return this.http.get(`${environment.fbURL}/zip_distance.json`);
  }

  getZipCodeById(id: string) {
    return this.http.get(`${environment.fbURL}/zip_distance/-MhmtevwIOXiL4IvEFGE/${id}.json`);
  }

  // generateZipData(zipList: Zip[]) {
  //   console.log(zipList, 'data')
  //   let result: zipData = {};
  //   const length = zipList.length;
  //   zipList.forEach(zip => result[zip.zip] = {});
  //
  //   for (let i = 0; i < length - 1; i++) {
  //     let zip1 = zipList[i];
  //     // result[zip1.zip][zip1.zip] = 0;
  //     for (let j = i + 1; j < length; j++) {
  //       let zip2 = zipList[j];
  //       let distance = this._calculateDistance(zip1, zip2);
  //       result[zip1.zip][zip2.zip] = distance;
  //       result[zip2.zip][zip1.zip] = distance;
  //       result[zip2.zip][zip2.zip] = 0;
  //
  //     }
  //   }
  //   // result[zipList[length-1].zip][zipList[length-1].zip] = 0;
  //   console.log(result, 'dict')
  //   return result;
  // }

  _calculateDistance(zip1: zipCode, zip2: zipCode): number {
    const R = 6371e3; // metres
    const phi1 = +zip1.latitude * Math.PI/180; // φ, λ in radians
    const phi2 = +zip2.latitude * Math.PI/180;
    const dPhi = (+zip2.latitude - +zip1.latitude) * Math.PI/180;
    const dLam = (+zip2.longitude - +zip1.longitude) * Math.PI/180;

    const a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(dLam/2) * Math.sin(dLam/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c / 1609; // in metres
    // console.log(zip1, zip2, 'nus')

    let cosD = Math.sin(+zip1.latitude) * Math.sin(+zip2.latitude) +
      Math.cos(+zip1.latitude) * Math.cos(+zip2.latitude) * Math.cos(+zip1.longitude - +zip1.longitude);

    // console.log(cosD, 'nus')
    // return Math.acos(cosD) * R;
    return d;
  }

  // calculateDistance(zip1: string, zip2: string): number {
  //   const zipA = zipCodes[zip1];
  //   const zipB = zipCodes[zip2];
  //
  //   return this._calculateDistance(zipA, zipB);
  // }

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

  // findDrivers(zip: string, distance: string): string[] {
  //   const zipCodes = [...codes];
  //   // const zipCodes = JSON.parse(codes);
  //   const res: string[] = [];
  //   const zip1: Zip = zipCodes.find(code => code.zip === zip);
  //   zipCodes.forEach(code => {
  //     if (this._calculateDistance(zip1, code) < +distance) {
  //       res.push(code.zip);
  //     }
  //   })
  //   return res;
  // }

  // generateJSON(): void {
  //   let res: zipCode = {};
  //   const zipCodes = Object.values(codes);
  //   console.log(zipCodes, 'codes')
  //   zipCodes.forEach(code => {
  //     res[code.zip] = {latitude: code.latitude, longitude: code.longitude};
  //   })
  //   console.log(res, 'res')
  //   this.http.post(`${environment.fbURL}/zip_codes.json`, res).subscribe(
  //     res => console.log(res)
  //   );
  // }

  // loadZips(): void {
  //   const driversRef = this.db.database.ref().child('drivers');
  //   const zipRef = this.db.database.ref().child('zip_codes');
  //   let params: zipCode[] = [];
  //   driversRef.orderByChild('zip').once('value', snap => {
  //     let zips = snap.val().map((res: { zip: any; }) => res.zip)
  //
  //     zipRef.on('child_added', snap => {
  //
  //       if (zips.includes(snap.val().zip)) {
  //         params.push(snap.val())
  //       }
  //     })
  //
  //     this.searchZip$.next(params);
  //   })
  // }

  getDriverZipCodes(zip: string, dist: string): void {
    const driversRef = this.db.database.ref().child('drivers');
    const zipRef = this.db.database.ref().child('zip_codes');
    let params: any[] = [];
    // let drivers: DriverDistance[] = [];
    let drivers: Driver[] = [];
    zipRef.orderByChild('zip').equalTo(zip).once('value', snap => {
      console.log(snap.val(), 'sasat');
      if (!snap.val()) {
        // @ts-ignore
        this.driversDistances$.next(null);
        return
      }

      // @ts-ignore
      let zipCode: zipCode = Object.values(snap.val())[0];
      console.log(zipCode)
      // driversRef.orderByChild('zip').once('value', snap => {
      driversRef.on('child_added', snap => {
        let driver: Driver = snap.val();
        // let zips = snap.val().map((res: { zip: any; }) => res.zip)
        console.log(snap.val(), 'driver')
        zipRef.on('child_added', snap => {
          // if (zips.includes(snap.val().zip)) {
          if (driver.zip === snap.val().zip) {
            // params.push(snap.val())
            console.log(snap.val(), 'proverochka')
            let distance = this._calculateDistance(snap.val(), zipCode);
            console.log(distance, 'distancia')
            if (distance < +dist) {
              drivers.push({ ...driver, distanceToZip: distance })
            }
          }
        })
        this.driversDistances$.next(drivers);
        console.log(params, 'sasasa');

      })
    })
    console.log(drivers, 'huya drivers')
  }

  getSearchZipCode(zip: string): Observable<zipCode> {
    let res!: zipCode;
    const zipRef = this.db.database.ref().child('zip_codes');
    zipRef.orderByChild('zip').equalTo(zip).once('value', snap => {
      console.log(snap.val(), 'snap');
      res = snap.val();
      this.searchZip$.next(res);
    })

    return this.searchZip$;
  }
}
