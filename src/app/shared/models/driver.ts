import {FormControl, FormGroup} from "@angular/forms";

export class Driver {
  id!: number;
  name!: string;
  zip!: number;
  status!: string;
  restTime!: string;
  notes!: string;

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
