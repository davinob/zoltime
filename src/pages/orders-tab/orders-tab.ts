import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';


import { OrdersNewPage } from '../orders-new/orders-new';
import { OrdersPendingPage } from '../orders-pending/orders-pending';
import { OrdersCompletedPage } from '../orders-completed/orders-completed';

@IonicPage()
@Component({
  selector: 'page-orders-tab',
  templateUrl: 'orders-tab.html'
})
export class OrdersTabPage {

constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  tab1Root = 'OrdersNewPage';
  tab2Root = 'OrdersPendingPage';
  tab3Root = 'OrdersCompletedPage';

 
}
