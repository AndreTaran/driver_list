import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Driver} from "../../shared/models/driver";
import {DriversService} from "../../shared/services/drivers.service";
import {map, take, takeUntil, takeWhile, tap} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {ZipService} from "../../shared/services/zip.service";
import {MatDialog} from "@angular/material/dialog";
import {DriverUpdateDialogComponent} from "../../shared/components/driver-update-dialog/driver-update-dialog.component";
import {Observable, timer} from "rxjs";
import {ReserveDialogComponent} from "../../shared/components/reserve-dialog/reserve-dialog.component";
import {Timer} from "../../shared/models/timer";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  @ViewChild('zipCode') zip!: ElementRef;
  @ViewChild('distance') distance!: ElementRef;
  @ViewChild('file') file!: ElementRef;

  codes$!: any;
  codes!: any;
  isFiltered!: boolean;

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
    // this.driversService.getFakeData().subscribe(res => {
    //   console.log(res, 'fake')
    // })
    // this.zipService.postZipCodes();
    //  this.zipService.getZipCodeById('20230').subscribe(res => {
    //    this.codes = res;
    //    console.log(this.codes, 'codessssss')
    //  });
    // this.distance.nativeElement.value = `${250}`;
    this.driversService.getFakeData().pipe(
      map(drivers => {
        console.log(drivers)
        return drivers;
      })
    ).subscribe(drivers => {
      console.log([...Object.values(drivers)], 'jij')
      this.dataSource = new MatTableDataSource([...Object.values(drivers)]);
      this._setUpTimers(this.dataSource.data);
    })
  }

  ngOnDestroy() {

  }



  searchDrivers(zip: string, distance: string) {
    if (!(zip || distance)) {
      this.zip.nativeElement.value = '';
      this.distance.nativeElement.value = '';
      this.dataSource.filter = '';
      this.isFiltered = true;
      return;
    }
    this.dataSource.filter = distance;
    this.isFiltered = false;
    this.codes$ = this.zipService.getZipCodeById(zip)
      .subscribe(res => {
      this.codes = res;
    })
    setTimeout(
        this.dataSource.filterPredicate = (data, filter) => {
          console.log(this.codes, filter, 'zaza')

          // @ts-ignore
          return this.codes[`${data.zip}`] < filter;
        },1000);

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
}
