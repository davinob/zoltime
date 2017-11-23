import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService, Product } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {TodayMenuPage} from '../today-menu/today-menu';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the UpdateQuantityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-quantity',
  templateUrl: 'update-quantity.html',
})
export class UpdateQuantityPage {

  
  public updateQuantityForm:FormGroup;
  myProduct:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public sellerService: SellerService,
   )  {

      this.myProduct=navParams.get('product');
      this.updateQuantityForm = formBuilder.group({
        quantity: [this.myProduct.currentQuantity, Validators.required],
      });

      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateQuantityPage');
  }



  updateQuantity(){
    if (!this.updateQuantityForm.valid){
      console.log("FORM INVALID"+this.updateQuantityForm.value);
    } else {
        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
        
         this.sellerService.updateCurrentProductQuantity(this.myProduct,
          this.updateQuantityForm.value.quantity)
        .then(()=> {
          console.log("Document successfully written!");
          this.navCtrl.setRoot(TodayMenuPage);
          }
        ).catch (error=>
        {
          this.alertAndLoadingService.showToast(error);
        });
        

   
      this.alertAndLoadingService.showLoading();
    }
  }

}
