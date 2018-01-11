import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService,Promotion,Product } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {UpdatePromotionSuitePage} from '../update-promotion-suite/update-promotion-suite';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the UpdatePromotionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-promotion',
  templateUrl: 'update-promotion.html',
})
export class UpdatePromotionPage {

  @ViewChild('fileInput') fileInput;
  @ViewChild('promotionStartTime') promotionStartTime;
  @ViewChild('promotionEndTime') promotionEndTime;
  @ViewChild('promotionStartDate') promotionStartDate;
  
  @ViewChild('daysInput') daysInput;

  

  public addPromotionForm:FormGroup;
  public promotion:Promotion;
  public selectedProducts:Array<Product>=[];
  public todayDateISO:String;
  public allProducts:Array<Product>;

  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public sellerService: SellerService
    )  {

      this.promotion=Object.assign({}, navParams.get('promotion'));
      console.log("Promo!!");
      console.log(this.promotion);


      console.log(this.selectedProducts);
     

      this.addPromotionForm = formBuilder.group({
        name: ['', Validators.required],
        dateOneTime: ['', Validators.required],
      });

      this.addPromotionForm.controls['dateOneTime'].setValue(this.promotion.isOneTime);
      this.addPromotionForm.controls['name'].setValue(this.promotion.name);

      this.todayDateISO= new Date().toISOString();
      this.allProducts=this.sellerService.getSellerProductsClone();
      
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePromotionPage');
   this.promotionStartDate.value.day=this.promotion.date.getDate();
   this.promotionStartDate.value.month=this.promotion.date.getMonth()+1;
   this.promotionStartDate.value.year=this.promotion.date.getFullYear();
   this.promotionStartDate._text=this.promotion.date.toDateString();

   this.setDate();
   

    this.allProducts.forEach((prod,index) =>
    {
      if (this.promotion.products[prod.key])
      {
      
        prod.quantity=this.promotion.products[prod.key].quantity;
        prod.reducedPrice=this.promotion.products[prod.key].reducedPrice;
        this.allProducts[index]=prod;
  
      }

      prod.enabled=(this.promotion.products[prod.key]!=null);
      if (prod.enabled)
      {
        this.selectedProducts.push(prod);
      }
     })

    console.log(this.allProducts);

    

    
    
  }


  choosePromotionDay(dayNum:number)
  {
    this.promotion.days[dayNum]=!this.promotion.days[dayNum];
 
  }

  isPromotionDayEnabled(dayNum:number)
  {
    return this.promotion.days[dayNum];
  }

  

  isOneTimePromotion()
  {
    return this.addPromotionForm.controls['dateOneTime'].value;
  }

  showPromotionStartTime()
  {
    this.promotionStartTime._elementRef.nativeElement.click();
  }

  showPromotionEndTime()
  {
    this.promotionEndTime._elementRef.nativeElement.click();
  }


  endisableProduct(product:any)
  {
    if (!product.enabled)
    {
      product.enabled=true;
      this.selectedProducts.push(product); 
  }
    else
    {
    product.enabled=false;
 
    this.selectedProducts=this.selectedProducts.filter(
      (prod)=>{
        return prod.key!=product.key});
    }

    console.log(this.selectedProducts);
    
  }

  setDate()
  {
    
    
    console.log(this.promotionStartDate.value.day);
    console.log(this.promotionStartDate.value.month);
    console.log(this.promotionStartDate.value.year);
    

    this.promotion.date=new Date("'"+this.promotionStartDate.value.year+"-"+this.promotionStartDate.value.month+"-"+this.promotionStartDate.value.day);
    
    
    var today=new Date();
    if (this.promotion.date.getDate()==today.getDate()&&
        this.promotion.date.getMonth()==today.getMonth()&&
        this.promotion.date.getFullYear()==today.getFullYear())
        {
          this.promotionStartDate._text="Today";
        }
    console.log("THE DATE");
    console.log(this.promotion.date);
  }

  isPromotionReadyToGo():boolean
  {
    return (this.addPromotionForm.value.name && this.isDateChosen() && this.isAtLeastOneProductEnabled())
    
    
  }

  isDateChosen():boolean
  {
  
    return this.isOneTimePromotion()||this.isAtLeastOneDayEnabled();
  }

  isAtLeastOneProductEnabled():boolean
  {
   return this.selectedProducts.length>0;
  }

  isAtLeastOneDayEnabled():boolean
  {
    for (var key in this.promotion.days) {
      if (this.promotion.days[key])
      return true;
    }
    return false;
  }

  isProductEnabled(product:any)
  {
    return product.enabled;
  }

  


  prePromotion(){
    if (!this.addPromotionForm.valid){
      console.log("FORM INVALID"+this.addPromotionForm.value);
    } else {
      this.promotion.name=this.addPromotionForm.value.name;
      this.promotion.isOneTime=this.isOneTimePromotion();
      this.navCtrl.push('UpdatePromotionSuitePage',{promotion:this.promotion,selectedProducts:this.selectedProducts});
    }
  }

}
