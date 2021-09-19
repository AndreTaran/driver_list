import {FormControl, FormGroup} from "@angular/forms";

export class Driver {
  id!: number;
  vehicleType!: string;
  driverName!: string;
  zip!: number;
  driverStatus!: string;
  driverHomeAddressState!: string;
  driverHomeAddressCity!: string;
  homeAddressZip!: string;
  driverPhoneNumber!: string;
  ownerName!: string;
  ownerPhoneNumber!: string;
  vehicleCapacity!: number;
  vehicleWeight!: number;
  hiringDate!: string;
  vinCode!: string;
  licenseNumber!: string;
  insuranceTimeOut!: string;
  vehicleBrand!: string;
  vehicleModel!: string;
  vehicleColor!: string;
  vehicleProductionYear!: string;
  vehicleInsideSizeWidth!: number;
  vehicleInsideSizeLength!: number;
  vehicleInsideSizeHeight!: number;
  vehicleDoorSizeWidth!: number;
  vehicleDoorSizeHeight!: number;
  isCitizen!: string;
  toCanada!: boolean;
  restTime!: string;
  notes!: string;
  lg!: boolean;
  p!: boolean;
  r!: boolean;
  ar!: boolean;
  dh!: boolean;
  t!: boolean;
  currentAddressState?: string;
  currentAddressCity?: string;
  pickUpTime?: string;
  dropTime?: string;
  distanceToZip?: number;

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

export type DriverDistance = {
  driver: Driver,
  distance: number,
}
