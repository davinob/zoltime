import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SellerService,Picture } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';
import {TodayMenuPage} from '../today-menu/today-menu';
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
        quantity: ['', Validators.required],
        originalPrice: ['', Validators.required],
        reducedPrice: ['', Validators.required],
        picture: ['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateProductPage');
  }



  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        targetHeight: 200
      }).then((data) => {
        this.addProductForm.patchValue({ 'picture': 'data:image/jpg;base64,' + data });
        this.uploadPicture(data,false);
      }, (err) => {
        alert('Unable to take photo');
      })
    } else { 
      this.fileInput.nativeElement.click();
    
    }
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
         this.alertAndLoadingService.dismissLoading();
      }
    )
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
        this.alertAndLoadingService.showAlert({message:"Please choose an image"});
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
        
         this.sellerService.addDefaultProductToCurrentUser(
          this.addProductForm.value.name,this.addProductForm.value.description,
          this.addProductForm.value.quantity,this.addProductForm.value.originalPrice,
          this.addProductForm.value.reducedPrice,this.picture)
        .then(()=> {
          console.log("Document successfully written!");
          this.navCtrl.setRoot(TodayMenuPage);
          }
        ).catch (error=>
        {
          this.alertAndLoadingService.showAlert(error);
        });
        

   
      this.alertAndLoadingService.showLoading();
    }
  }

}
