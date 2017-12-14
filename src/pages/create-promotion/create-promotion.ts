import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService,Promotion } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {CreatePromotionSuitePage} from '../create-promotion-suite/create-promotion-suite';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the CreatePromotionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-promotion',
  templateUrl: 'create-promotion.html',
})
export class CreatePromotionPage {

  @ViewChild('fileInput') fileInput;
  @ViewChild('promotionStartTime') promotionStartTime;
  @ViewChild('promotionEndTime') promotionEndTime;
  @ViewChild('promotionStartDate') promotionStartDate;
  
  @ViewChild('daysInput') daysInput;

  

  public addPromotionForm:FormGroup;
  public promotion:Promotion;
  public selectedProducts:Array<any>=[];
  public todayDateISO:String;

  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public sellerService: SellerService)  {


      this.addPromotionForm = formBuilder.group({
        name: ['', Validators.required],
        dateOneTime: ['', Validators.required],
      });

      this.promotion={name:"",
      promotionStartTime:"00:00",
      promotionEndTime:"00:00",
      isOneTime:true,
      days:{1:false,2:false,3:false,4:false,5:false,6:false,7:false},
      products:{},
      date:new Date()
      };

      this.addPromotionForm.controls['dateOneTime'].setValue(true);
      this.todayDateISO= new Date().toISOString();
      
      
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePromotionPage');
    this.promotionStartDate._text="Today";
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    this.promotionStartDate.value.day=dd;
    this.promotionStartDate.value.month=mm;
    this.promotionStartDate.value.year=yyyy;

    

    
    
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
      (prod)=>{return prod.key!=product.key});
    }
    
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
      this.navCtrl.push('CreatePromotionSuitePage',{promotion:this.promotion,selectedProducts:this.selectedProducts});
    }
  }

}
