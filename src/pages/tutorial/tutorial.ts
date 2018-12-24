import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform,Content } from 'ionic-angular';

 


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
import { Observable } from 'rxjs';


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

  @ViewChild('startTimes') startTimes:ElementRef;
  @ViewChild('endTimes') endTimes:ElementRef ;
  @ViewChild(Content) content: Content;

  
  
  public signupForm:FormGroup;

  searchAddress: string="";
  addresses: Array<any> = [];
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  addressJSON:Address;


  
  
 
  profilePic:Picture;



  constructor(public navCtrl: NavController, 
    public menu: MenuController, 
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
        url:"assets/icon/store.png"};
      
  }


  getCategories():any
  {
    return globalConstants.categories;
  }

  getCategory()
  {
    if (!this.signupForm.value.category)
    return "נא לבחור סוג המסעדה...";
    else
    return this.signupForm.value.category
  }


  startApp() {
    this.navCtrl.setRoot('ProductsPage', {}, {
      animate: true,
      direction: 'forward'
    });
  }


  days=["א'","ב'","ג'","ד'","ה'","ו'","ש'"];


  daysToSave=this.sellerService.inititateSellerDays();




  showStartTime(id)
  {
    let collec:HTMLCollection=this.startTimes.nativeElement.children;
    (<HTMLElement>(collec.item(id))).click();
  }

  showEndTime(id)
  {
    let collec:HTMLCollection=this.endTimes.nativeElement.children;
    (<HTMLElement>(collec.item(id))).click();
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



  
   lastStringTyped:string="";

   async setFilteredItems() {
     console.log("FILTERING ADDRESSES");
     console.log(this.lastStringTyped);
     console.log(this.searchAddress);
     if ((this.searchAddress==null)||(this.searchAddress.length<2)
     ||(this.lastStringTyped==this.searchAddress)||(!this.shouldShowAddresses))
     {
       if ((this.searchAddress==null)||(this.searchAddress.length<2))
         this.addressSelected=false;
       this.addresses=new Array();
       return;
     }
     this.lastStringTyped=this.searchAddress;
     this.searching=true;
       this.addressSelected=false;
       let theAdresses=await this.addressService.filterItems(this.searchAddress);
       
       this.addresses=theAdresses;
       this.searching=false;
      
   }



   async selectAddress(address:any)
   {
     console.log("SELECT ADDRESS" + address.description);
     this.addresses=new Array();
     
     try{
       
       let addressJSON=await this.addressService.getPosition(address);
       this.searchAddress=address.description;
        this.addressSelected=true;
       console.log(addressJSON);
       this.addressJSON=addressJSON;
       this.lastStringTyped=this.searchAddress;
     }
     catch(error)
     {
       this.alertAndLoadingService.showToast({message:error});
       this.addressJSON=null;
       this.searchAddress=null;
       this.addressSelected=false;
     }
    
     
     this.addressInput.setFocus();
   }
  
 
  
      
  showAddresses(toShow:boolean)
  {
  
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
       this.alertAndLoadingService.showToast({message:error});
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
        this.alertAndLoadingService.showToast({message:"נא לבחור תמונה"});
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
  

  async signupUser(){
    if (!this.signupForm.valid){
      console.log("FORM INVALID"+this.signupForm.value);
      this.alertAndLoadingService.showToast({message:"פרטים לא נכונים"});
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

        this.alertAndLoadingService.showLoading();

        try{
          let user=this.sellerService.getCurrentSeller();
          console.log("SIGNUP:"+user);
        await this.sellerService.updateCurrentUser(
          this.addressJSON,this.signupForm.value.description,this.signupForm.value.telNo,
        this.profilePic,hashgahaValue,this.signupForm.value.category,this.daysToSave);
        }
        catch(error)
        {
          this.alertAndLoadingService.dismissLoading();
          this.alertAndLoadingService.showToast({message:error});
        }
       
          this.startApp();
          console.log(this.signupForm.value.hashgaha);
          console.log("Document successfully written!");
        
        

   
     
    }
  }

}
