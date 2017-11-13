import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CreateProductPage } from '../create-product/create-product';
import { UserService, User,Picture } from '../../providers/user-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { UploadService,Upload } from '../../providers/upload-service';
import { Camera,CameraOptions  } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  editInput(product:any)
  {
    this.navCtrl.push(CreateProductPage);
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


  
  

  imageURI=null;
  productClicked=null;

  updatePicture(product:any) {
    this.productClicked=product;
    if (Camera['installed']()) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
   
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.uploadImage();
    }, (err) => {
      console.log(err);
    });
  }
  else
  {
    this.fileInput.nativeElement.click();
  }
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
          this.imageURI=event.target.files[0];
          this.uploadImage();
        }
       }
  }

  uploadImage()
  {
    console.log("UPLOAD IMAGE");
    console.log(this.productClicked);
         let currentUpload = new Upload(this.imageURI,"products");
     
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
    
  

}
