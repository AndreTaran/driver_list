import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayedColumns: string[] = ['id', 'name', 'zip', 'status', 'rest time', 'notes'];
  rows!: FormArray;
  form!: FormGroup;


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    drivers.forEach((data: Driver) => this.addRow(data, false));

  }

  addRow(data?: Driver, noUpdate?: boolean) {

  }



}
