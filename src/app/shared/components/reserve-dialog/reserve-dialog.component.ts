import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Driver} from "../../models/driver";
import {Observable} from "rxjs";

@Component({
  selector: 'app-reserve-dialog',
  templateUrl: './reserve-dialog.component.html',
  styleUrls: ['./reserve-dialog.component.scss']
})
export class ReserveDialogComponent implements OnInit {
  minutes!: any;
  seconds!: any;

  constructor(public dialogRef: MatDialogRef<ReserveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {driver: Driver, timer: Observable<any>}) { }

  ngOnInit(): void {
  }

  onNoClose() {
    this.dialogRef.close()
  }

  onReserve() {
    const result = (+this.seconds + (+this.minutes) * 60);
    this.dialogRef.close(result);
  }

}
