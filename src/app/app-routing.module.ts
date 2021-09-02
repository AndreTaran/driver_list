import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DriversComponent} from "./components/drivers/drivers.component";
import {OrdersComponent} from "./components/orders/orders.component";
import { BrokersComponent} from "./components/broker/brokers.component";
import {MainLayoutComponent} from "./shared/main-layout/main-layout.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {AddDriverComponent} from "./components/add-driver/add-driver.component";

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'drivers', pathMatch: 'full'},
      {path: 'drivers', component: DriversComponent, canActivate: [AuthGuard]},
      {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},
      {path: 'brokers', component: BrokersComponent, canActivate: [AuthGuard]},
      {path: 'add-driver', component: AddDriverComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginPageComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
