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

  timer$: any;
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

    this.driversService.getAll().pipe(
      map(drivers => {
        console.log(drivers)
        return drivers;
      })
    ).subscribe(drivers => {
      console.log([...Object.values(drivers)], 'jij')
      this.drivers = [...Object.values(drivers)];
      this.dataSource = new MatTableDataSource(this.drivers);
      this._setUpTimers(this.dataSource.data);

      this.zipService.getZipCodes();
    })
  }

  searchDrivers(zip: string, distance: string): void {
    if (!zip && !distance) {
      this.zip.nativeElement.value = '';
      this.distance.nativeElement.value = '';
    }

    let searchZip: zipCode = {};
    this.zipService.getSearchZipCode(zip).then(res => {
      console.log(res.val(), 'resssult')
      // @ts-ignore
      let searchZip: zipCode = Object.values(res.val())[0];
      console.log(this.zipService.zipCodes$.getValue(), 'lol a cho')
      const zips: zipCode[] = this.zipService.zipCodes$.getValue();
      // console.log(this.dataSource.data, 'lol a cho')
      let drivers: Driver[] = [];
      this.drivers.forEach(driver => {
        // @ts-ignore
        let driverZip: zipCode = zips.find(el => el.zip === driver.zip)
        console.log(driverZip, 'driverZip')
        let dist: number = -1;
        if ((searchZip && driverZip))  {
          dist = this.zipService._calculateDistance(searchZip, driverZip);
          driver.distanceToZip = dist;
          console.log(dist, 'distance')
          console.log(driver.distanceToZip, 'driver distance')
          console.log(dist > -1, dist < +distance, 'lol')
          if (dist > -1 && dist < +distance) {
            console.log(driver, 'driver')
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
      console.log(res, 'ssssssssssssssssss')
    })
    console.log(searchZip, 'gooooool')
    let drivers: Driver[] = []
    this.zipService.zipCodes$.subscribe(res => {
      console.log(res, 'zips');
      console.log(searchZip, 'gooooool')

    })
  }

  showFloat(distance: any): number {
    return Math.trunc(+distance);
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  show(code: any) {
    console.log(code, 'kek')
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
      console.log('The dialog was closed');
      if (result) {
        this.chosenDriver = result.driver;
        this.chosenDriver.restTime = result.time;
        console.log(result)
      }
    });
  }

  openReserveDialog(): void {
    const dialogRef = this.dialog.open(ReserveDialogComponent, {
      width: '300px',
      data: {driver: this.chosenDriver},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.reserve(this.chosenDriver.id, result)
      }
    });
  }

  reserve(id: number, reserveTime: number) {
    this.timerList[id].reservedTime = reserveTime
    this.timerList[id].isShown = true
    console.log(id, this.timerList[id].reservedTime, 'counter')
    this.timerList[id].timer$ = timer(100, 1000).pipe(
      map(i => {
        console.log(i)
        return (this.timerList[id].reservedTime - i)
      }),
      take(this.timerList[id].reservedTime + 1),
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
    return insuranceTimeOut - today > 7;
  }
}
