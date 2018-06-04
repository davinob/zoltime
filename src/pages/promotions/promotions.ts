import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SellerService, Seller,Promotion,Product } from '../../providers/seller-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { Camera,CameraOptions  } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DatePicker } from '@ionic-native/date-picker';

import 'rxjs/Rx';
/**
 * Generated class for the PromotionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-promotions',
  templateUrl: 'promotions.html',
})
export class PromotionsPage {


  allInputsShows:any={};
  sellerProducts:Array<Product>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sellerService:SellerService, public alertAndLoadingService: AlertAndLoadingService
    , public formBuilder: FormBuilder,
    private elRef:ElementRef,
    public toastCtrl: ToastController ) {

      this.sellerProducts=this.sellerService.getSellerProductsClone();
      
  }

  
  getProductsOfPromotion(promotion:Promotion):Array<Product>
  {
    return this.sellerProducts.filter( prod =>{
      return promotion.products[prod.key]!=null
    }
    );
  
  }

  

 


  shouldShowPromotion(promotion:Promotion):boolean
  {
    return promotion.isActivated && !this.sellerService.isPromotionExpired(promotion);
  }
  
  startPromo(promotion:Promotion)
  {
    this.sellerService.startPromotion(promotion);
  }

  stopPromo(promotion:Promotion)
  {
    this.sellerService.stopPromotion(promotion);
  }

 

  ionViewDidEnter(){
    console.log('ionViewDidEnter PromotionsPage');
    this.sellerService.initPromotionMessages();
  }

  addPromotion(){
  
    this.navCtrl.push('CreatePromotionPage');
  }


  

  removeInput(promotion:any)
  {
 
    this.alertAndLoadingService.
    presentConfirm("Are you sure you want to remove this promotion?").then(
      (response)=>
      {
        if (response)
        {
          console.log("Deleting promotion");
          console.log(promotion);
          this.sellerService.removePromotionFromCurrentSeller(promotion);
        }
      }
    )
  }




  
  editPromotion(promotion:Promotion)
  {
    console.log("HALLO");
    this.navCtrl.push('UpdatePromotionPage',{promotion:promotion});
  }

 

  
  
  



    
  

}
