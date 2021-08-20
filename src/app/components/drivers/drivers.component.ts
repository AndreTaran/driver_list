import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { Driver } from 'src/app/shared/models/driver';
import {MatTableDataSource} from "@angular/material/table";
import {DriversService} from "../../shared/services/drivers.service";
import {filter} from "rxjs/operators";
import {ConfirmDialogComponent} from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  form!: FormGroup;
  myDatePicker!: any;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'zip', 'status', 'restTime', 'notes', 'buttons'];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private fb: FormBuilder,
              private driversService: DriversService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      drivers: this.fb.array([])
    });
    this.driversService.getAllAsFormArray()
      .subscribe(drivers => {
        console.log(drivers, 'sss')
        this.form.setControl('drivers', drivers);
        this.dataSource = new MatTableDataSource((this.form.get('drivers') as FormArray).controls);
        this.dataSource.filterPredicate = (data: FormGroup, filter: string) => {
          return Object.values(data.controls).some(x => x.value == filter)
        }
      })

  }

  get drivers(): FormArray {
    return this.form.get('drivers') as FormArray;
  }

  applySearch(search: any) {
    console.log(search, 'value');
    if (!search) {
      this.filter.nativeElement.value = search;
    }
    this.dataSource.filter = search.trim().toLowerCase();
  }

  saveData(element: FormGroup) {
    console.log('save', element.value)
    return this.driversService.updateData({
      ...element.value,
      id: element.value.id,
      name: element.value.name,
      zip: element.value.zip,
      status: element.value.status,
      restTime: element.value.restTime.toString(),
      notes: element.value.notes,
    })
  }

  cancelChanges(element: FormGroup) {
    this.driversService.getById(element.value)
      .subscribe(res => {
        element.setValue({
          id: res.id,
          name: res.name,
          zip: res.zip,
          status: res.status,
          restTime: new Date(res.restTime),
          notes: res.notes,
        })
      })

  }

  confirmDialogSave(element: FormGroup): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.saveData(element);
      }
    });
  }

  confirmDialogCancel(element: FormGroup): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.cancelChanges(element);
      }
    });
  }
}
