import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Driver} from "../../models/driver";

@Component({
  selector: 'app-driver-update-dialog',
  templateUrl: './driver-update-dialog.component.html',
  styleUrls: ['./driver-update-dialog.component.scss']
})
export class DriverUpdateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DriverUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {driver: Driver, time: Date}) {}


  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  // TODO reserve -seconds, 15 min default, cancel reserve
  // TODO unavail driver
}
