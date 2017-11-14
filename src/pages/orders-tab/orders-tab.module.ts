import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersTabPage } from './orders-tab';

@NgModule({
  declarations: [
    OrdersTabPage
  ],
  imports: [
    IonicPageModule.forChild(OrdersTabPage),
  ],
  exports: [
    OrdersTabPage
  ]
})
export class OrdersTabPageModule {}

