import {FormControl, FormGroup} from "@angular/forms";

export class Driver {
  id!: number;

  // DRIVER INFO
  driverName!: string;
  driverPhoneNumber!: string;
  driverStatus!: string;
  driverHomeAddressState!: string;
  driverHomeAddressCity!: string;
  homeAddressZip!: string;
  currentAddressState?: string;
  currentAddressCity?: string;
  hiringDate!: string;
  vinCode!: string;
  licenseNumber!: string;
  insuranceTimeOut!: string;
  isCitizen!: string;
  toCanada!: boolean;

  // VEHICLE INFO
  vehicleType!: string;
  vehicleCapacity!: number;
  vehicleWeight!: number;
  vehicleBrand!: string;
  vehicleModel!: string;
  vehicleProductionYear!: string;
  vehicleInsideSizeWidth!: number;
  vehicleInsideSizeLength!: number;
  vehicleInsideSizeHeight!: number;
  vehicleDoorSizeWidth!: number;
  vehicleDoorSizeHeight!: number;

  // OWNER INFO
  ownerName!: string;
  ownerPhoneNumber!: string;

  lg!: boolean;
  p!: boolean;
  r!: boolean;
  ar!: boolean;
  dh!: boolean;
  t!: boolean;

  zip!: number;
  pickUpTime?: string;
  dropTime?: string;
  distanceToZip?: number;
  restTime!: string;

  notes!: string;



  static asFormGroup(driver: Driver): FormGroup {
    return new FormGroup({
      id: new FormControl(driver.id),
      driverName: new FormControl(driver.driverName),
      zip: new FormControl(driver.zip),
      driverStatus: new FormControl(driver.driverStatus),
      restTime: new FormControl(new Date(driver?.restTime)),
      notes: new FormControl(driver.notes),
    });
  }
}
