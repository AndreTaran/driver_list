import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DriversService} from "../../shared/services/drivers.service";

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  myForm!: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private driverService: DriversService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      'driverName': ['', Validators.required],
      'hiringDate': [new Date(), Validators.required],
      'driverHomeAddressState': ['', Validators.required],
      'driverHomeAddressCity': ['', Validators.required],
      'driverStatus': ['available', Validators.required],
      'driverCurrentZip': ['', Validators.required],
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

  onSubmit():void {
    this.driverService.addDriver(this.myForm.value);
    console.log(this.myForm)
  }

}
