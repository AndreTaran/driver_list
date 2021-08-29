import {FormControl, FormGroup} from "@angular/forms";

export class Driver {
  id!: number;
  vehicleType!: string;
  name!: string;
  zip!: number;
  status!: string;
  homeAddressState!: string;
  homeAddressCity!: string;
  homeAddressZip!: string;
  phoneNumber!: string;
  driverBossName!: string;
  phoneNumberBoss!: string;
  vehicleCapacity!: number;
  vehicleWeight!: number;
  hiringData!: string;
  vinCode!: string;
  licenseNumber!: string;
  insuranceTimeOut!: string;
  carBrand!: string;
  carModel!: string;
  carColor!: string;
  carProductionYear!: string;
  carInsideWidth!: number;
  carInsideLength!: number;
  carInsideHeight!: number;
  carDoorWidth!: number;
  carDoorHeight!: number;
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
  currentAddressState!: string;
  currentAddressCity!: string;
  pickUpTime!: string;
  dropTime!: string;

  static asFormGroup(driver: Driver): FormGroup {
    return new FormGroup({
      id: new FormControl(driver.id),
      name: new FormControl(driver.name),
      zip: new FormControl(driver.zip),
      status: new FormControl(driver.status),
      restTime: new FormControl(new Date(driver.restTime)),
      notes: new FormControl(driver.notes),
    });
  }
}
