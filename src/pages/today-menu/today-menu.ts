import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CreateProductPage } from '../create-product/create-product';
import { UserService, User } from '../../providers/user-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';

/**
 * Generated class for the TodayMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-today-menu',
  templateUrl: 'today-menu.html',
})
export class TodayMenuPage {


  allInputsShows:any={};
  @ViewChild('promotionStartTime') promotionStartTime;
  @ViewChild('promotionEndTime') promotionEndTime;

 
    
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService:UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodayMenuPage');
  }


  addProduct(){
    this.navCtrl.push(CreateProductPage);
  }

  showPromotionStartTime()
  {
    this.promotionStartTime._elementRef.nativeElement.click();
  }

  showPromotionEndTime()
  {
    this.promotionEndTime._elementRef.nativeElement.click();
  }

}
