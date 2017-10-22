import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersTabPage } from './orders-tab';

@NgModule({
  declarations: [
    OrdersTabPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersTabPage),
  ],
})
export class OrdersTabPageModule {}

