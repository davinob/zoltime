import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersCompletedPage } from './orders-completed';

@NgModule({
  declarations: [
    OrdersCompletedPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersCompletedPage),
  ],
})
export class OrdersCompletedPageModule {}

