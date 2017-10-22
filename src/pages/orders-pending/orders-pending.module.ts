import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersPendingPage } from './orders-pending';

@NgModule({
  declarations: [
    OrdersPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersPendingPage),
  ],
})
export class OrdersPendingPageModule {}

