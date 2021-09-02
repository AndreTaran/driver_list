import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DriversComponent} from './components/drivers/drivers.component';
import {OrdersComponent} from './components/orders/orders.component';
import {BrokersComponent} from './components/broker/brokers.component';
import {MainLayoutComponent} from './shared/main-layout/main-layout.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginPageComponent} from './components/login-page/login-page.component';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HttpClientModule} from "@angular/common/http";
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import { DriverUpdateDialogComponent } from './shared/components/driver-update-dialog/driver-update-dialog.component';
import { ReserveDialogComponent } from './shared/components/reserve-dialog/reserve-dialog.component';
import { AddDriverComponent } from './components/add-driver/add-driver.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    DriversComponent,
    OrdersComponent,
    BrokersComponent,
    MainLayoutComponent,
    LoginPageComponent,
    ConfirmDialogComponent,
    DriverUpdateDialogComponent,
    ReserveDialogComponent,
    AddDriverComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        HttpClientModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatPaginatorModule,
        MatCheckboxModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
