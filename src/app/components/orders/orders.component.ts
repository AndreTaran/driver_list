import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Driver} from "../../shared/models/driver";
import {DriversService} from "../../shared/services/drivers.service";
import {map, take, takeLast, takeUntil, takeWhile, tap} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {zipCode, ZipService} from "../../shared/services/zip.service";
import {MatDialog} from "@angular/material/dialog";
import {DriverUpdateDialogComponent} from "../../shared/components/driver-update-dialog/driver-update-dialog.component";
import {BehaviorSubject, combineLatest, forkJoin, Observable, timer} from "rxjs";
import {ReserveDialogComponent} from "../../shared/components/reserve-dialog/reserve-dialog.component";
import {Timer} from "../../shared/models/timer";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('zipCode') zip!: ElementRef;
  @ViewChild('distance') distance!: ElementRef;
  @ViewChild('file') file!: ElementRef;

  searchZip!: zipCode;
  codes!: any;
  isFiltered!: boolean;
  drivers: Driver[] = [];

  counter: any;

  chosenDriver!: Driver;

  timerList: Timer = {};


  displayedColumns = ['idAndType', 'driverStatus', 'driverZipAndMiles',
                      'stateAndCity', 'timeAndVehicle', 'flags',
                      'driverNameAndAddress', 'isCitizenAndToCanada',
                      'size', 'ETA', 'driverName',
                      'driverContact', 'ownerName', 'ownerContact'];

  dataSource = new MatTableDataSource<Driver>();
  constructor(private driversService: DriversService,
              private zipService: ZipService,
              private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.isFiltered = true;

    this.driversService.getAllAvailable().pipe(
      map(drivers => {
        return drivers;
      })
    ).subscribe(drivers => {
      this.drivers = [...Object.values(drivers)];
      this.dataSource = new MatTableDataSource(this.drivers);
      this._setUpTimers(this.dataSource.data);
      this.initTimers();

      this.zipService.getZipCodes();
    });

  }

  searchDrivers(zip: string, distance: string): void {
    if (!zip && !distance) {
      this.zip.nativeElement.value = '';
      this.distance.nativeElement.value = '250';
      this.dataSource = new MatTableDataSource(this.drivers);
      return;
    }

    let searchZip: zipCode = {};
    this.zipService.getSearchZipCode(zip).then(res => {
      // @ts-ignore
      let searchZip: zipCode = Object.values(res.val())[0];
      const zips: zipCode[] = this.zipService.zipCodes$.getValue();
      let drivers: Driver[] = [];
      this.drivers.forEach(driver => {
        // @ts-ignore
        let driverZip: zipCode = zips.find(el => el.zip === driver.zip)
        let dist: number = -1;
        if ((searchZip && driverZip))  {
          dist = this.zipService._calculateDistance(searchZip, driverZip);
          driver.distanceToZip = dist;
          if (dist > -1 && dist < +distance) {
            drivers.push(driver);
          }
        }
      })
      this.dataSource = new MatTableDataSource(drivers);
    });

    // this.dataSource.filter = distance;
    // this.zipService.getDriverZipCodes(zip, distance);
    // setTimeout(() => {
    //
    //   let driversZip: Driver[] = [];
    //   this.zipService.driversDistances$.subscribe(res => {
    //     driversZip = res;
    //   })
    //
    //   this.dataSource = new MatTableDataSource(driversZip)
    // }, 3000);
    this.zipService.searchZip$.subscribe(res => {
      searchZip = res;
    })
    let drivers: Driver[] = []
    this.zipService.zipCodes$.subscribe(res => {

    })
  }

  showFloat(distance: any): number {
    return Math.trunc(+distance);
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  chose(element: Driver) {
    this.chosenDriver = element;
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(DriverUpdateDialogComponent, {
      width: '500px',
      data: {driver: this.chosenDriver, time: new Date(this.chosenDriver.restTime.toString())}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chosenDriver = result.driver;
        this.chosenDriver.restTime = result.time;
        this.driversService.updateData(result.driver);
      }
    });
  }

  openReserveDialog(): void {
    const dialogRef = this.dialog.open(ReserveDialogComponent, {
      width: '300px',
      data: {driver: this.chosenDriver},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reserve(this.chosenDriver.id, result)
        this.saveTimers();
      }
    });
  }

  reserve(id: number, reserveTime: number) {
    this.timerList[id].date = new Date();
    this.timerList[id].reservedTime = reserveTime;
    this.timerList[id].isShown = true;
    this.timerList[id].timer$ = timer(100, 1000).pipe(
      map(i => {
        return (this.timerList[id].reservedTime - i);
      }),
      // take(this.timerList[id].reservedTime + 1),
      // takeUntil(this.ngOnDestroy())
    )
    setTimeout(() => this.timerList[id].isShown = false, reserveTime * 1000)

  }

  _setUpTimers (data: Driver[]) {
    // @ts-ignore
    data.forEach(driver => this.timerList[driver.id] = {})
  }

  isLicenceRunsOut(driver: Driver): boolean {
    const today = new Date();
    const insuranceTimeOut = new Date(driver.insuranceTimeOut);

    // @ts-ignore
    return (insuranceTimeOut - today) > 7;
  }

  countEtaToPu(miles: number): string {
    if (miles === 0) {
      return new Date().toString();
    } else if (!miles) {
      return '-';
    }

    let date = new Date();
    date.setDate(date.getDate() + +miles/50);

    return date.toString();
  }

  getEmailClipBoardMessage(driver: Driver): string {
    return `sosi huy ${driver.driverName}`;
  }

  initTimers(): void {
    const timers: Timer = JSON.parse(<string>localStorage.getItem('timers'));
    for (let timer in timers) {
      const now = new Date();
      let timeReserved = new Date(timers[timer].date);
      let tillReserved = new Date(timeReserved);
      tillReserved.setMinutes(timeReserved.getMinutes() + timers[timer].reservedTime / 60);
      const timeLeft = +now - +tillReserved;
      if ((+now - +tillReserved) < 0) {
        this.reserve(+timer, (+tillReserved - +now) / 1000);
      }

    }
  }

  saveTimers(): void {
    localStorage.setItem('timers', JSON.stringify(this.timerList));
  }

  formatTimer(time: number): string {
    if (time > 60) {
      return `${(time / 60).toString().split('.')[0]}:${(time % 60).toString().split('.')[0]}`
    }
    return time.toString().split('.')[0];
  }

  cancelReserve(): void {
    this.reserve(this.chosenDriver.id, 0);
    this.saveTimers();
  }
}
