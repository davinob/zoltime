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
import * as globalConstants from '../../providers/globalConstants'; 


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

  @ViewChild('categoryInput') categoryInput;

  @ViewChild('hashgahaInput') hashgahaInput;
  
  public signupForm:FormGroup;

  searchAddress: string = '';
  addresses: any;
  
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  
  addressJSON:Address;


  
  
 
  profilePic:Picture;



  constructor(public navCtrl: NavController, 
    public menu: MenuController, translate: TranslateService, 
    public platform: Platform,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService,
    public sellerService: SellerService,
    public camera: Camera,
    private upSvc: UploadService) 
  {
    this.dir = platform.dir();
   
      this.signupForm = formBuilder.group({
        description: [''],
        telNo: [''],
        address: ['', Validators.required],
        picture: [''],
        hashgaha: ['ללא', Validators.required],
        category: ['', Validators.required]
      });

      this.profilePic={
        folder:"",
        name:"",
        url:"/assets/icon/store.png"};
      
  }


  getCategories():any
  {
    return globalConstants.categories;
  }

  getCategory()
  {
    if (!this.signupForm.value.category)
    return "Please select your restaurant category...";
    else
    return this.signupForm.value.category
  }


  startApp() {
    this.navCtrl.setRoot('ProductsPage', {}, {
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
        if (this.profilePic.folder)
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
    this.categoryInput._elementRef.nativeElement.click();
  }

  showHashgahaChoiceSelect()
  {
    this.hashgahaInput._elementRef.nativeElement.click();
  }

 

  getHashgahot()
  {
    return globalConstants.hashgahot;
  }
  

  signupUser(){
    if (!this.signupForm.valid){
      console.log("FORM INVALID"+this.signupForm.value);
    } else {

   
      let hashgahaValue=this.signupForm.value.hashgaha;
        
        if (hashgahaValue=="ללא")
        {
          hashgahaValue={"כשר":false,"למהדרין":false};
        }
        else if (hashgahaValue=="כשר")
        {
          hashgahaValue={"כשר":true,"למהדרין":false};
        }
        else
        {
          hashgahaValue={"כשר":true,"למהדרין":true};
        }


        let user=this.sellerService.getCurrentSeller();
        console.log("SIGNUP:"+user);
         this.sellerService.updateCurrentUser(
          this.addressJSON,this.signupForm.value.description,this.signupForm.value.telNo,
        this.profilePic,hashgahaValue,this.signupForm.value.category)
        .then(()=> {
          this.startApp();
          console.log(this.signupForm.value.hashgaha);
          console.log("Document successfully written!");
          })
        

   
      this.alertAndLoadingService.showLoading();
    }
  }

}
