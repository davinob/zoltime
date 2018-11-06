import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,Select  } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SellerService, Seller } from '../../providers/seller-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { Camera,CameraOptions  } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import 'rxjs/Rx';
/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {


  allInputsShows:any={};
  @ViewChild('promotionStartTime') promotionStartTime;
  @ViewChild('promotionEndTime') promotionEndTime;
  @ViewChild('fileInput') fileInput;
  @ViewChild("selectPictureType") selectPictureType: Select;

  
 
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sellerService:SellerService, public alertAndLoadingService: AlertAndLoadingService
    , public formBuilder: FormBuilder,
    public camera: Camera,
    private upSvc: UploadService,
    private elRef:ElementRef,
    public toastCtrl: ToastController ) {
  }

  
  
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
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
   return   this.sellerService.getSellerProducts()==null|| (<Array<any>>this.sellerService.getSellerProducts()).length<=0;
  }


  
  editProduct(product:any)
  {
    console.log("HALLO");
    this.navCtrl.push('UpdateProductPage',{product:product});
  }

  fileOrBase64String=null;
  productClicked=null;


  choosePictureType(product:any)
  {
    this.selectPictureType.open();
   this.productClicked=product;
    console.log(product);
  }

  updatePicture(product:any, typeChosen:any) {

    if (this.selectPictureType.value.length==0)
    {
      return;
    }
    this.selectPictureType.value=null; 
   
    if (Camera['installed']()) {

      let sourceType=this.camera.PictureSourceType.SAVEDPHOTOALBUM;
      if (typeChosen=="Camera")
      sourceType=this.camera.PictureSourceType.CAMERA;
     
      this.takePicture(sourceType);
      }

      else { 
        this.fileInput.nativeElement.click();
      
      }

    }

      takePicture(srcType:number)
      {
       this.upSvc.takePicture(srcType).then((data) => {
         console.log("PIC TAKEN!");
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
