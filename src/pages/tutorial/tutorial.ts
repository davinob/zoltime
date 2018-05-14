import { Component,ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';


import { AuthService } from '../../providers/auth-service';
import { SellerService } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';

import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../providers/global-service';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  
  showSkip = false;
  dir: string = 'rtl';

  @ViewChild('description') descriptionInput ;
  @ViewChild('address') addressInput ;
  @ViewChild('fileInput') fileInput;
  @ViewChild('selectPictureType') selectPictureType;

  @ViewChild('categoriesInput') categoriesInput;

  @ViewChild('hashgahaInput') hashgahaInput;
  
  public signupForm:FormGroup;

  searchAddress: string = '';
  addresses: any;
  
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  
  addressJSON:Address;


  hashgahot:string[]=["Kosher","Lemehadrin","No"];
  
 
  profilePic:Picture;


  constructor(public navCtrl: NavController, 
    public menu: MenuController, translate: TranslateService, 
    public platform: Platform,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService,
    public sellerService: SellerService,
    public camera: Camera,
    private upSvc: UploadService,
   private globalSvc: GlobalService) 
  {
    this.dir = platform.dir();
   
      this.signupForm = formBuilder.group({
        description: [''],
        telNo: [''],
        address: ['', Validators.required],
        picture: [''],
        hashgaha: ['', Validators.required],
        categories: ['', Validators.required]
      });
  }


  startApp() {
    this.navCtrl.setRoot('OrdersTabPage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = false;//!slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    
     this.signupForm.controls.address.valueChanges.debounceTime(400).subscribe(search => {
           this.setFilteredItems();
       });
   }



  setFilteredItems() {
    console.log("FILTERING ADDRESSES");
  if ((this.searchAddress==null)||(this.searchAddress.length<2)||(this.shouldShowAddresses==false))
  { 
    this.addresses=null;
    return;
  }
      this.searching=true;
      this.addressSelected=false;
      this.addressService.filterItems(this.searchAddress).first().subscribe((listOfAddresses)=>
      {
         this.searching=false;
         this.addresses=listOfAddresses.value;
      });

  }



  addressJustSet:boolean=false;
  
  selectAddress(address:any)
  {
    console.log("SELECT ADDRESS" + address.description);
    this.addresses=null;
    this.searchAddress=address.description;
    this.addressSelected=true;
    
    
    this.addressService.getPosition(address.place_id).first().subscribe((addressJSON)=>
    {
        console.log(addressJSON);
        this.addressJSON=addressJSON.value;
    });
    
    this.addressJustSet=true;  
   this.addressInput.setFocus();
    
  }
  
 
  
  showAddresses(toShow:boolean)
  {
    if (this.addressJustSet)
    {
      this.addressJustSet=false;
      return;
    }
    console.log("SHOW ADRESS: "+toShow);
   this.shouldShowAddresses=toShow;  
   if (!toShow)
   {
   this.searching=false;
   if (!this.addressSelected)
    this.searchAddress=null;
   }
  }


  choosePictureType()
  {
    console.log(this.selectPictureType);
    console.log(this.selectPictureType.nativeElement);
    this.selectPictureType._elementRef.nativeElement.click();
  }


  getPicture(typeChosen:any) {
    console.log(typeChosen);
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



  uploadPicture(picture:any,isFile:boolean)
  {
    let currentUpload = new Upload(picture,"profilePic",isFile);
    
    this.alertAndLoadingService.showLoading();
    this.upSvc.pushUpload(currentUpload).then(
      (resultPic:Picture)=>
      {
        if (this.profilePic!=null)
          this.upSvc.deletePicture(this.profilePic);
        this.profilePic=resultPic;      
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
    return 'url(' + this.signupForm.controls['picture'].value + ')'
  }


  showCategoriesChoiceSelect()
  {
    this.categoriesInput._elementRef.nativeElement.click();
  }

  showHashgahaChoiceSelect()
  {
    this.hashgahaInput._elementRef.nativeElement.click();
  }

  jsonCatego(arr:string[]):any
  {
    let myCategos:any=<any>{};
      arr.forEach(element => {
        myCategos[element]=true;
      });

    return myCategos;
  }


  signupUser(){
    if (!this.signupForm.valid){
      console.log("FORM INVALID"+this.signupForm.value);
    } else {
        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
        let jsonCatego:any=this.jsonCatego(this.signupForm.value.categories);
         this.sellerService.updateCurrentUser(
          this.addressJSON,this.signupForm.value.description,this.signupForm.value.telNo,
        this.profilePic,this.signupForm.value.hashgaha
        ,jsonCatego)
        .then(()=> {
          this.startApp();
          console.log(this.signupForm.value.hashgaha);
          console.log("Document successfully written!");
          })
        

   
      this.alertAndLoadingService.showLoading();
    }
  }

}
