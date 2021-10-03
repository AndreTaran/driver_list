import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DriversComponent} from "./components/drivers/drivers.component";
import {OrdersComponent} from "./components/orders/orders.component";
import { BrokersComponent} from "./components/broker/brokers.component";
import {MainLayoutComponent} from "./shared/main-layout/main-layout.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {AddDriverComponent} from "./components/admin/add-driver/add-driver.component";
import {AdminGuard} from "./shared/services/admin.guard";
import {AddUserComponent} from "./components/admin/add-user/add-user.component";

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'drivers', component: DriversComponent, canActivate: [AuthGuard]},
      {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},
      {path: 'brokers', component: BrokersComponent, canActivate: [AuthGuard]},
      {path: 'add-driver', component: AddDriverComponent, canActivate: [AuthGuard, AdminGuard]},
      {path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard, AdminGuard]},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
