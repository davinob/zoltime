import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SellerService, Seller } from '../../providers/seller-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { Camera,CameraOptions  } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';
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
  @ViewChild('fileInput') fileInput;

  
    
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sellerService:SellerService, public alertAndLoadingService: AlertAndLoadingService
    , public formBuilder: FormBuilder,
    public camera: Camera,
    private upSvc: UploadService,
    private elRef:ElementRef,
    public toastCtrl: ToastController ) {

      if (this.shouldShowCurrentPromotion())
      {
        console.log("starting timer?");
        this.sellerService.startPromotionTimer();
      }
      
  }

  
  
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodayMenuPage');
  }




  updateUserField(fieldName:string,field:any)
  {
   // this.alertAndLoadingService.showLoading();

    this.sellerService.updateCurrentUserField(fieldName,field).then
    (
      (successEvent)=>
      {
     //   this.alertAndLoadingService.dismissLoading();
      }
    )
    .catch(error=>
    {
   //   this.alertAndLoadingService.showToast({message:"Plese check your network connection is active."});
    });
  }



  addProduct(){
    if (this.shouldShowCurrentPromotion())
    return;
    this.navCtrl.push('CreateProductPage');
  }

  showPromotionStartTime()
  {
    this.promotionStartTime._elementRef.nativeElement.click();
  }

  showPromotionEndTime()
  {
    this.promotionEndTime._elementRef.nativeElement.click();
  }

  

  removeInput(product:any)
  {
    if (this.shouldShowCurrentPromotion())
    return;

    this.alertAndLoadingService.
    presentConfirm("Are you sure you want to remove this product?").then(
      (response)=>
      {
        if (response)
        {
          console.log("Deleting product");
          console.log(product);
          this.sellerService.removeDefaultProductFromCurrentUser(product);
        }
      }
    )
  }

  editField(product:any,fieldName:string,fieldvalue:string,description:string)
  {
    this.alertAndLoadingService.
    presentPrompt(fieldName,fieldvalue,description).then(
      (response)=>
      {
        console.log(response);
          console.log("Setting product value: "+fieldName+" "+response);

          this.sellerService.updateCurrentUserDefaultProductField(product,fieldName,response);
        
      }
    )
  }


  isPublishDisabled():boolean
  {
   return this.sellerService.getCurrentSeller().promotionStartTime==null || 
   this.sellerService.getCurrentSeller().promotionEndTime==null || 
   this.sellerService.getCurrentDefaultProducts()==null||
   (<Array<any>>this.sellerService.getCurrentDefaultProducts()).length<=0;
  }



   
  getQuantity(product:any)
  {
    if (this.shouldShowCurrentPromotion())
    return "Quantity: "+product.currentQuantity;
    else
    return "Initial Quantity: "+product.quantity;
  }

  shouldShowCurrentPromotion():boolean
  {
   return (this.sellerService.getCurrentSeller().promotionStartDateTime!=null && this.sellerService.getCurrentSeller().promotionEndDateTime!=null)
  }

  stopTodayPromotion()
  {
   // this.alertAndLoadingService.showLoading();
    this.sellerService.stopTodayPromotion().then
    (stopPromo=>
    {
      this.alertAndLoadingService.dismissLoading();
    }).catch(error=>
      {
       //this.alertAndLoadingService.showToast(error);
      })
  }



  publishTodayPromotion()
  {
    //this.alertAndLoadingService.showLoading();
   
    if (this.sellerService.getCurrentSeller().promotionStartTime==null)
    return;
    if (this.sellerService.getCurrentSeller().promotionEndTime==null)
    return;

    let startTime=(this.sellerService.getCurrentSeller().promotionStartTime.split(":",2));
    let hourStart=Number.parseInt(startTime[0]);
    let minuteStart=Number.parseInt(startTime[1]);
    

    let endTime=this.sellerService.getCurrentSeller().promotionEndTime.split(":",2)
    let hourEnd=Number.parseInt(endTime[0]);
    let minuteEnd=Number.parseInt(endTime[1]);
    

    let date=new Date();
    let nowHour=date.getHours();
    let nowMinutes=date.getMinutes();
    

    console.log("NOW: "+nowHour+":"+nowMinutes);

    if ((nowHour>hourStart)||((nowHour==hourStart)&&((nowMinutes>minuteStart)))) //promotion not in same day
    {
      console.log("ADDED ONE DAY to start TIME");
      date=new Date(date.valueOf()+(1000 * 60 * 60 * 24));
      console.log(date.toDateString());
    }

    date.setHours(hourStart);
    date.setMinutes(minuteStart);
    date.setSeconds(0);

    this.sellerService.getCurrentSeller().promotionStartDateTime=date.valueOf();

    
    
    if ((hourStart>hourEnd)||((hourStart==hourEnd)&&((minuteStart>minuteEnd)))) //promotion not in same day
    {
      date=new Date(date.valueOf()+(1000 * 60 * 60 * 24));
    }
    
    date.setHours(hourEnd);
    date.setMinutes(minuteEnd);


  this.sellerService.getCurrentSeller().promotionEndDateTime=date.valueOf();
    console.log("ENDs"+date.getHours()+":"+date.getMinutes());

    this.sellerService.startTodayPromotion().then
    (startPromo=>
    {
     // this.alertAndLoadingService.dismissLoading();
    }).catch(error=>
      {
      // this.alertAndLoadingService.showToast(error);
      })
   
  }
  


  getCurrentPromotionTimerMessage():string
  {
    return this.sellerService.promotionMessage;
    
  }
  
  editProduct(product:any)
  {
    console.log("HALLO");
    if (this.shouldShowCurrentPromotion())
    this.navCtrl.push('UpdateQuantityPage',{product:product});
    else
    this.navCtrl.push('UpdateProductPage',{product:product});
  }

  fileOrBase64String=null;
  productClicked=null;



  updatePicture(product:any) {
    if (this.shouldShowCurrentPromotion())
    return;
    
    this.productClicked=product;

    if (Camera['installed']()) {
      let sourceType=this.camera.PictureSourceType.PHOTOLIBRARY;
      this.alertAndLoadingService.
      showChoice("Take a picture from:","Gallery","Camera").then(
        (response)=>
        {
          if (response)
          {
            sourceType=this.camera.PictureSourceType.CAMERA
          }

          this.takePicture(sourceType);
        });
      }

      else { 
        this.fileInput.nativeElement.click();
      
      }

    }

      takePicture(srcType:number)
      {
       this.upSvc.takePicture(srcType).then((data) => {
       this.fileOrBase64String = data;
      this.uploadImage(false);
      }, (err) => {
        //alert('Unable to take photo');
      })
    } 




  uploadImage(isFile:boolean)
  {
    console.log("UPLOAD IMAGE");
    console.log(this.productClicked);
         let currentUpload = new Upload(this.fileOrBase64String,"products",isFile);
     
          this.alertAndLoadingService.showLoading();
          this.upSvc.pushUpload(currentUpload).then(
            (resultPic:Picture)=>
            {
              let picture=resultPic;
              this.sellerService.updateCurrentUserDefaultProductField(this.productClicked,"picture",picture);
              this.alertAndLoadingService.dismissLoading();
              }
          ).catch(error=>
           {
            this.alertAndLoadingService.showToast(error);
           })
        
     }



  processImage(event:any)
  {
    console.log("IMAGE PROCESS");
    console.log(event);
    let reader = new FileReader();
     if ((event.target.files!=null)&&(event.target.files[0]!=null))
     { 
       if(event.target.files[0].type.match('image.*'))
        {
          reader.readAsDataURL(event.target.files[0]);
          this.fileOrBase64String=event.target.files[0];
          this.uploadImage(true);
        }
       }
  }


  
  



    
  

}
