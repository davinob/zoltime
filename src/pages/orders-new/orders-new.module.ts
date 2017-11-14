import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersNewPage } from './orders-new';

@NgModule({
  declarations: [
    OrdersNewPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersNewPage),
  ],
  exports:[
    OrdersNewPage
  ]
})
export class OrdersNewPageModule {}

