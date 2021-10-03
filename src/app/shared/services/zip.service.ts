import {Injectable} from '@angular/core';
import {Zip} from "../models/zip";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {BehaviorSubject, Observable} from "rxjs";
import {Driver} from "../models/driver";

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
  // @ts-ignore
  zipCodes$: BehaviorSubject<zipCode[]> = new BehaviorSubject<zipCode[]>(null);

  constructor(private http: HttpClient,
              private afs: AngularFirestore,
              private db: AngularFireDatabase,
              private  fs: AngularFireStorage) {
  }

  // getZipCodes() {
  //   return this.http.get(`${environment.fbURL}/zip_distance.json`);
  // }

  getZipCodeById(id: string) {
    return this.http.get(`${environment.fbURL}/zip_distance/-MhmtevwIOXiL4IvEFGE/${id}.json`);
  }

  _calculateDistance(zip1: zipCode, zip2: zipCode): number {
    // metres
    const R = 6371e3;
    console.log(zip1, zip2)
    // φ, λ in radians
    const phi1 = +zip1.latitude * Math.PI/180;
    const phi2 = +zip2.latitude * Math.PI/180;
    const dPhi = (+zip2.latitude - +zip1.latitude) * Math.PI/180;
    const dLam = (+zip2.longitude - +zip1.longitude) * Math.PI/180;

    const a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(dLam/2) * Math.sin(dLam/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c / 1609; // in miles
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

  getSearchZipCode(zip: string) {
    let res!: zipCode;
    const zipRef = this.db.database.ref().child('zip_codes');
    return zipRef.orderByChild('zip').equalTo(zip).once('value', snap => {
      console.log(snap.val(), 'snap');
    });
  }

  getZipCodes() {
    const driversRef = this.db.database.ref().child('drivers');
    const zipRef = this.db.database.ref().child('zip_codes');
    let result: zipCode[] = [];

    driversRef.once('child_added', snap => {
      let driver: Driver = snap.val();
      console.log(driver, 'driver')
      console.log(driver.zip)
      zipRef.orderByChild('zip').equalTo(driver.zip).once('value', snap => {
        console.log(snap.key, snap.val(), 'ccicicicicic')
        if (Array.isArray(snap.val())) {
          result.push(snap.val()[snap.val().length - 1]);
        } else {
          result.push(<zipCode>Object.values(snap.val())[0])
        }
        console.log(result, 'ny sho')
      })
    }).then(() => this.zipCodes$.next(result));

  }
}
