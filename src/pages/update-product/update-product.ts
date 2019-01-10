import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SellerService } from '../../providers/seller-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';

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
  categorySelected;

 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public sellerService: SellerService,
    public modalCtrl:ModalController
   )  {

      this.myProduct=navParams.get('product');
      this.updateProductForm = formBuilder.group({
        name: [this.myProduct.name, Validators.required],
        nameFr: [this.myProduct.nameFr, Validators.required],
        nameEn: [this.myProduct.nameEn, Validators.required],
        description: [this.myProduct.description, Validators.required],
        descriptionFr: [this.myProduct.descriptionFr, Validators.required],
        descriptionEn: [this.myProduct.descriptionEn, Validators.required],
        originalPrice: [this.myProduct.originalPrice, Validators.required]
      });

      this.categorySelected=this.myProduct.category;

      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateProductPage');
  }


  showCategoriesChoiceSelect()
  {
    let modalPage=this.modalCtrl.create('ModalSelectPage',{dataList:this.sellerService.getProductCategoriesChoices()});
    modalPage.present();
    modalPage.onDidDismiss(data=>
      {
        console.log("MODAL DISMMISS");
        console.log(data);
        this.categorySelected=data.chosen;
      });
  }




  updateProduct(){
    if (!this.updateProductForm.valid){
      console.log("FORM INVALID"+this.updateProductForm.value);
      this.alertAndLoadingService.showToast({message:"פרטים לא נכונים"});
    } else {
        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
        
         this.sellerService.updateDefaultProductToCurrentUser(this.myProduct,
          this.updateProductForm.value.name,this.updateProductForm.value.nameFr,this.updateProductForm.value.nameEn,
          this.updateProductForm.value.description,this.updateProductForm.value.descriptionFr,this.updateProductForm.value.descriptionEn,
          this.updateProductForm.value.originalPrice,this.categorySelected)
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
