import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService,Promotion,Product } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {PromotionsPage} from '../promotions/promotions';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the CreatePromotionSuitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-promotion-suite',
  templateUrl: 'create-promotion-suite.html',
})
export class CreatePromotionSuitePage {

  @ViewChild('daysInput') daysInput;

  

  public promotion:Promotion;
  public selectedProducts:Array<any>;

  public 

  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public sellerService: SellerService)  {

      
      this.promotion=navParams.get('promotion');
      this.selectedProducts=navParams.get('selectedProducts');
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePromotionSuitePage');
  }


  getURL(url:string)
  {
    return 'url(' + url + ')';
  }

  checkAndCalculateDiscount(product:Product)
  {
    let originalPriceVal=product.originalPrice;
    let reducedPriceVal=product.reducedPrice;
    if (originalPriceVal!=0)
      {
        let discountVal=Math.round(((originalPriceVal-reducedPriceVal)/originalPriceVal)*100*100)/100;
        if (discountVal<25)
        {
          this.alertAndLoadingService.showToast({message:"Reduction should be more than 25%"});
          product.discount=100;
          product.reducedPrice=0;

        }
        else
        {
          product.discount=discountVal;
        }
      }
  }

  checkAndCalculateReducedPrice(product:Product)
  {
  
    let originalPriceVal=product.originalPrice;
    let discountVal=product.discount;
    if (originalPriceVal!=0)
      {
        if (discountVal<25)
        {
          this.alertAndLoadingService.showToast({message:"Reduction should be more than 25%"});
          product.discount=100;
          product.reducedPrice=0;
         }
        else
        {
          let newPriceVal=Math.round((originalPriceVal-(originalPriceVal)*discountVal/100)*100)/100;
          product.reducedPrice=newPriceVal;
       }
      }

      
  }





  addPromotion(){
    if (!this.isPromotionReadyToGo()){
      console.log("FORM INVALID");
    } else {
      console.log("SELECTED PRODUCTS TO BE ADDED:");
      console.log(this.selectedProducts);
      this.selectedProducts.forEach(
        prod=>{
          this.promotion.products[prod.key]={reducedPrice:prod.reducedPrice,quantity:prod.quantity,currentQuantity:prod.quantity};
        }
      )

         this.sellerService.addPromotionToCurrentUser(this.promotion)
        .then(()=> {
          console.log("Document successfully written!");
        
          }
        )
   
     this.navCtrl.setRoot("PromotionsPage");
    }
  }


  isPromotionReadyToGo():boolean
  {
    for (let i = 0; i < this.selectedProducts.length; i++) {
      if (!this.selectedProducts[i].quantity)
        return false;
    }

      return true;
  }

}
