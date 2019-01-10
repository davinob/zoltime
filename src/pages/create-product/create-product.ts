import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select, ModalController } from 'ionic-angular';
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
  @ViewChild("selectPictureType") selectPictureType: Select;

  public addProductForm:FormGroup;

  categorySelected;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService,
    public sellerService: SellerService,
    private camera: Camera,
    private upSvc: UploadService,
    public modalCtrl:ModalController
    )  {


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

  
  choosePictureType()
  {
    this.selectPictureType.open();
  }

  getPicture(typeChosen:any) {
    console.log(typeChosen);
    if (this.selectPictureType.value.length==0)
    {
      return;
    }

    this.selectPictureType.value=null;

    if (Camera['installed']()) {
      let sourceType=this.camera.PictureSourceType.SAVEDPHOTOALBUM;
      if (typeChosen=="מצלמה")
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
        console.log(resultPic);
        
        if (this.picture!=null)
          this.upSvc.deletePicture(this.picture);
        this.picture=resultPic;      
        this.addProductForm.patchValue({ 'picture': 'data:image/jpg;base64,' + picture });
         this.alertAndLoadingService.dismissLoading();
      }
    ).catch(error=>
      {
      this.alertAndLoadingService.showToast({message:error});
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
        this.alertAndLoadingService.showToast({message:"נא לבחור תמונה"});
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
      this.alertAndLoadingService.showToast({message:"פרטים לא נכונים"});
    } else {
        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
        
         this.sellerService.addProductToCurrentUser(
          this.addProductForm.value.name,this.addProductForm.value.description,
         this.addProductForm.value.originalPrice,
          this.picture,this.categorySelected)
        .then(()=> {
          console.log("Document successfully written!");
        
          }
        )
   
      this.navCtrl.setRoot(ProductsPage);
    }
  }

}
