import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {ProductsPage} from '../products/products';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the UpdateProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-product',
  templateUrl: 'update-product.html',
})
export class UpdateProductPage {

  
  public updateProductForm:FormGroup;
  myProduct:any;

  @ViewChild('categoriesInput') categoriesInput;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public sellerService: SellerService,
   )  {

      this.myProduct=navParams.get('product');
      this.updateProductForm = formBuilder.group({
        name: [this.myProduct.name, Validators.required],
        category: [this.myProduct.category, Validators.required],
        description: [this.myProduct.description, Validators.required],
        originalPrice: [this.myProduct.originalPrice, Validators.required]
      });

      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateProductPage');
  }


  showCategoriesChoiceSelect()
  {
    this.categoriesInput._elementRef.nativeElement.click();
  }




  updateProduct(){
    if (!this.updateProductForm.valid){
      console.log("FORM INVALID"+this.updateProductForm.value);
      this.alertAndLoadingService.showToast({message:"פרטים לא נכונים"});
    } else {
        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
        
         this.sellerService.updateDefaultProductToCurrentUser(this.myProduct,
          this.updateProductForm.value.name,this.updateProductForm.value.description,
          this.updateProductForm.value.originalPrice,this.updateProductForm.value.category)
        .then(()=> {
          console.log("Document successfully written!");
       
          }
        ).catch (error=>
        {
       //   this.alertAndLoadingService.showToast({message:error});
        });
        

        this.navCtrl.setRoot(ProductsPage);
     // this.alertAndLoadingService.showLoading();
    }
  }

}
