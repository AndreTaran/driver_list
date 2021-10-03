import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DriversService} from "../../../shared/services/drivers.service";
import {map, tap} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  myForm!: FormGroup;
  lastDriver: any;
  constructor(private formBuilder: FormBuilder,
              private driverService: DriversService) { }

  ngOnInit(): void {
    this.getLastDriver().subscribe(driver => {
      this.lastDriver = driver[driver.length - 1]
      console.log(this.lastDriver, 'huyyy')

    });
    this.myForm = this.formBuilder.group({
      'driverName': ['', Validators.required],
      'hiringDate': [new Date(), Validators.required],
      'driverHomeAddressState': ['', Validators.required],
      'driverHomeAddressCity': ['', Validators.required],
      'driverHomeAddressZip': ['', Validators.required],
      'driverStatus': ['available', Validators.required],
      'driverPhoneNumber': ['', Validators.required],
      'vehicleType': ['sprinter', Validators.required],
      'vehicleBrand': ['', Validators.required],
      'vehicleModel': ['', Validators.required],
      'vehicleCapacity': ['', Validators.required],
      'vehicleWeight': ['', Validators.required],
      'vehicleInsideSizeLength': ['', Validators.required],
      'vehicleInsideSizeWidth': ['', Validators.required],
      'vehicleInsideSizeHeight': ['', Validators.required],
      'vehicleDoorSizeWidth': ['', Validators.required],
      'vehicleDoorSizeHeight': ['', Validators.required],
      'vehicleProductionYear': [new Date, Validators.required],
      'vinCode': ['', Validators.required],
      'licenseNumber': ['', Validators.required],
      'insuranceTimeOut': [new Date, Validators.required],
      'isCitizen': ['none', Validators.required],
      'toCanada': [false, Validators.required],
      'ownerName': ['', Validators.required],
      'ownerPhoneNumber': ['', Validators.required],
      'notes': ['', Validators.required],
      'lg': [false, Validators.required],
      'r': [false, Validators.required],
      'ar': [false, Validators.required],
      'p': [false, Validators.required],
      't': [false, Validators.required],
      'dh': [false, Validators.required],
    })
  }

  onSubmit(event: any):void {
    event.stopPropagation();
    let userId = this.lastDriver ? this.lastDriver?.id + 1 : 0;
    console.log(userId)
    this.driverService.addDriver(userId, {id: userId, ...this.myForm.value}).subscribe(
      response => {
        console.log(response);
        this.myForm.reset();
      }
    )
    this.getLastDriver().subscribe(driver => {
      this.lastDriver = driver
    });

  }

  getLastDriver() {
    return this.driverService.getLastDriver().pipe(
      map(res => Object.values(res))
    );
  }

}
