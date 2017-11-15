import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserService, User,Picture } from '../../providers/user-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { UploadService,Upload } from '../../providers/upload-service';
import { Camera,CameraOptions  } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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
    private userService:UserService, public alertAndLoadingService: AlertAndLoadingService
    , public formBuilder: FormBuilder,
    public camera: Camera,
    private upSvc: UploadService,
    private elRef:ElementRef,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodayMenuPage');
  }


  addProduct(){
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
    this.alertAndLoadingService.
    presentConfirm("Are you sure you want to remove this product?").then(
      (response)=>
      {
        if (response)
        {
          console.log("Deleting product");
          console.log(product);
          this.userService.removeDefaultProductFromCurrentUser(product);
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

          this.userService.updateCurrentUserDefaultProductField(product,fieldName,response);
        
      }
    )
  }


  isPublishDisabled():boolean
  {
   return this.userService.getCurrentUser().promotionStartTime==null || 
   this.userService.getCurrentUser().promotionEndTime==null || 
   this.userService.getCurrentDefaultProducts()==null||
   (<Array<any>>this.userService.getCurrentDefaultProducts()).length<=0;
  }



   

  shouldShowCurrentPromotion():boolean
  {
   return (this.userService.getCurrentUser().promotionStartDateTime!=null && this.userService.getCurrentUser().promotionEndDateTime!=null)
  }

  stopTodayPromotion()
  {
    this.userService.getCurrentUser().promotionStartDateTime=null;
    this.userService.getCurrentUser().promotionEndDateTime=null;
    this.timerSubscription.unsubscribe();
  }



  publishTodayPromotion()
  {
   
    if (this.userService.getCurrentUser().promotionStartTime==null)
    return;
    if (this.userService.getCurrentUser().promotionEndTime==null)
    return;

    let startTime=(this.userService.getCurrentUser().promotionStartTime.split(":",2));
    let minuteStart=Number.parseInt(startTime[1]);
    let hourStart=Number.parseInt(startTime[0]);

    let endTime=this.userService.getCurrentUser().promotionStartTime.split(":",2)
    let minuteEnd=Number.parseInt(endTime[1]);
    let hourEnd=Number.parseInt(endTime[0]);

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

    this.userService.getCurrentUser().promotionStartDateTime=date.valueOf();

    date.setHours(hourEnd);
    date.setMinutes(minuteEnd);
    this.userService.getCurrentUser().promotionEndDateTime=date.valueOf();

    if ((hourStart>hourEnd)||((hourStart==hourEnd)&&((minuteStart>minuteEnd)))) //promotion not in same day
    {
      this.userService.getCurrentUser().promotionEndDateTime=this.userService.getCurrentUser().promotionEndDateTime+(1000 * 60 * 60 * 24);
    }

   this.timerSubscription=Observable.timer(0,1000).
    subscribe(
      ()=>
      {
      let nowDate=new Date();
        let promotionHasStarted=false;
        

        let timeDiffInSecBeforeStart=Math.round(new Date(this.userService.getCurrentUser().promotionStartDateTime-nowDate.valueOf()).valueOf()/1000);
        let timeDiffInSec=timeDiffInSecBeforeStart;
        if (timeDiffInSecBeforeStart<=0)
        {
          promotionHasStarted=true;
          timeDiffInSec=Math.round(new Date(this.userService.getCurrentUser().promotionEndDateTime-nowDate.valueOf()).valueOf()/1000);
          if (timeDiffInSec<0)
          {
            this.stopTodayPromotion();
            return;
          }
            
        }

        console.log("TIME DIFF:"+timeDiffInSec);
        let secondsDiff=timeDiffInSec%(60);
        timeDiffInSec-=secondsDiff;
        
        let timeDiffInMin=timeDiffInSec/60;
        let minutesDiff=(timeDiffInMin)%60;
        timeDiffInMin-=minutesDiff;
        let hoursDiff=timeDiffInMin/60;

      
        if (promotionHasStarted)
        {
          this.promotionMessage= "Promotion ends in: "+this.formT(hoursDiff)+":"+this.formT(minutesDiff)+":"+this.formT(secondsDiff);
        }
        else
        {
          this.promotionMessage= "Promotion starts in: "+this.formT(hoursDiff)+":"+this.formT(minutesDiff)+":"+this.formT(secondsDiff);
        }
        
      
    }
    );
  }

  formT(num:number):string
  {
     if (num.toString().length==1)
      return "0"+num;
    return num+"";
  }

 

  

  timerSubscription:Subscription;
  promotionMessage:string;


  getCurrentPromotionTimerMessage():string
  {
    return this.promotionMessage;
    
  }
  
  editProduct(product:any)
  {
    this.navCtrl.push('UpdateProductPage',{product:product});
  }

  fileOrBase64String=null;
  productClicked=null;

  updatePicture(product:any) {
    this.productClicked=product;
    if (Camera['installed']()) {
    const options: CameraOptions = {
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }
   
    this.camera.getPicture(options).then((imageData) => {
      this.fileOrBase64String = imageData;
      this.uploadImage(false);
    }, (err) => {
      console.log(err);
    });
  }
  else
  {
    this.fileInput.nativeElement.click();
  }
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
              //this.upSvc.deletePicture(product.picture);
              let picture=resultPic;
              this.userService.updateCurrentUserDefaultProductField(this.productClicked,"picture",picture);
              this.alertAndLoadingService.dismissLoading();
              }
          )
        
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
