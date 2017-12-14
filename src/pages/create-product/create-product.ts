import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {ProductsPage} from '../products/products';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CreateProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-product',
  templateUrl: 'create-product.html',
})
export class CreateProductPage {

  @ViewChild('fileInput') fileInput;

  public addProductForm:FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService,
    public sellerService: SellerService,
    public camera: Camera,
    private upSvc: UploadService)  {


      this.addProductForm = formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        originalPrice: ['', Validators.required],
        picture: ['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateProductPage');
  }

  
    

 


  getPicture(typeChosen:any) {
   
    let sourceType=this.camera.PictureSourceType.PHOTOLIBRARY;
    if (typeChosen=="Camera")
    sourceType=this.camera.PictureSourceType.CAMERA;

   

    if (Camera['installed']()) {
      let sourceType=this.camera.PictureSourceType.PHOTOLIBRARY;
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
        this.uploadPicture(data,false);
      }, (err) => {
        //alert('Unable to take photo');
      })
    } 
 

  picture:Picture;

  uploadPicture(picture:any,isFile:boolean)
  {
    let currentUpload = new Upload(picture,"products",isFile);
    
    this.alertAndLoadingService.showLoading();
    this.upSvc.pushUpload(currentUpload).then(
      (resultPic:Picture)=>
      {
        if (this.picture!=null)
          this.upSvc.deletePicture(this.picture);
        this.picture=resultPic;      
        this.addProductForm.patchValue({ 'picture': 'data:image/jpg;base64,' + picture });
         this.alertAndLoadingService.dismissLoading();
      }
    ).catch(error=>
      {
      this.alertAndLoadingService.showToast(error);
      })
  }
  
  processWebImage(event) {
    console.log("PROCESS WEB IMAGE");
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.addProductForm.patchValue({ 'picture': imageData });
     };
    console.log(event);
    if ((event.target.files!=null)&&(event.target.files[0]!=null))
     { 
       if(event.target.files[0].type.match('image.*'))
        {
          reader.readAsDataURL(event.target.files[0]);
          this.uploadPicture(event.target.files[0],true);
        
        }
        else
        this.alertAndLoadingService.showToast({message:"Please choose an image"});
     }
    
  }

  getProfileImageStyle() {
    return 'url(' + this.addProductForm.controls['picture'].value + ')'
  }

  jsonCatego(arr:string[]):any
  {
    let myCategos:any=<any>{};
      arr.forEach(element => {
        myCategos[element]=true;
      });

    return myCategos;
  }


  addProduct(){
    if (!this.addProductForm.valid){
      console.log("FORM INVALID"+this.addProductForm.value);
    } else {
        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
        
         this.sellerService.addProductToCurrentUser(
          this.addProductForm.value.name,this.addProductForm.value.description,
         this.addProductForm.value.originalPrice,
          this.picture)
        .then(()=> {
          console.log("Document successfully written!");
        
          }
        )
   
      this.navCtrl.setRoot(ProductsPage);
    }
  }

}
