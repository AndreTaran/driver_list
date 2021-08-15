import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DriversComponent} from "./components/drivers/drivers.component";
import {OrdersComponent} from "./components/orders/orders.component";
import { BrokersComponent} from "./components/broker/brokers.component";
import {MainLayoutComponent} from "./shared/main-layout/main-layout.component";

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'drivers', pathMatch: 'full'},
      {path: 'drivers', component: DriversComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'brokers', component: BrokersComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
