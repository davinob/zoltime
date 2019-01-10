import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform,Content, ModalController } from 'ionic-angular';

 


import { AuthService } from '../../providers/auth-service';
import { SellerService } from '../../providers/seller-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';

import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  @ViewChild('startTimes') startTimes:ElementRef;
  @ViewChild('endTimes') endTimes:ElementRef ;
  @ViewChild(Content) content: Content;

  
  chosenCategory;
  chosenHashgaha="ללא";


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
    private upSvc: UploadService,
    public modalCtrl:ModalController) 
  {
    this.dir = platform.dir();
   
      this.signupForm = formBuilder.group({
        description: [''],
        telNo: [''],
        address: ['', Validators.required],
        picture: ['']      
       
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

  
  getCategoriesNames():any
  {

    return globalConstants.categories.map(data=>data.name);
  }

  getCategory()
  {
    if (!this.chosenCategory)
    return "נא לבחור סוג המסעדה...";
    else
    return this.chosenCategory;
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
    let modalPage=this.modalCtrl.create('ModalSelectPage',{dataList:this.getCategoriesNames()});
    modalPage.present();
    modalPage.onDidDismiss(data=>
      {
        console.log("MODAL DISMMISS");
        console.log(data);
        this.chosenCategory=data.chosen;
      });
  }

  showHashgahaChoiceSelect()
  {
    let modalPage=this.modalCtrl.create('ModalSelectPage',{dataList:this.getHashgahot()});
    modalPage.present();
    modalPage.onDidDismiss(data=>
      {
        console.log("MODAL DISMMISS");
        console.log(data);
        this.chosenHashgaha=data.chosen;
      });
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

   
      let hashgahaValue;
        
        if (this.chosenHashgaha=="ללא")
        {
          hashgahaValue={"כשר":false,"למהדרין":false};
        }
        else if (this.chosenHashgaha=="כשר")
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
        this.profilePic,hashgahaValue,this.chosenCategory,this.daysToSave);
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
