import { Component,ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, 
  Loading,TextInput, Select, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { LoginPage } from '../login/login';
import { SellerService, Seller } from '../../providers/seller-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Observable } from 'rxjs/Observable';

import { Camera } from '@ionic-native/camera';

import { UploadService,Upload,Picture } from '../../providers/upload-service';
import { AddressService,Address } from '../../providers/address-service';

import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../../providers/global-service';
import * as globalConstants from '../../providers/globalConstants'; 
import { interval } from 'rxjs';
import { first } from 'rxjs/operators';




@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {

  @ViewChild('fileInput') fileInput;

  @ViewChild("selectPictureType") selectPictureType: Select;
  @ViewChild('addressInput') addressInput :TextInput;

  @ViewChild('startTimes') startTimes:ElementRef;
  @ViewChild('endTimes') endTimes:ElementRef ;

  

  public loading:Loading;

  allInputsShows:any={};

  
  searchAddressInput=false;

  nameSaved:string;
  telNoSaved:string;
  descriptionSaved:string;
  descriptionFrSaved:string;
  descriptionEnSaved:string;
  
  
  public updateForm:FormGroup;

  constructor(public navCtrl: NavController, public authData: AuthService, 
  private sellerService:SellerService,  public navParams: NavParams,
  public alertAndLoadingService: AlertAndLoadingService,
  public addressService: AddressService,
  public camera: Camera,
  private upSvc: UploadService,
  public formBuilder: FormBuilder,
  public globalSvc:GlobalService,
  public modalCtrl:ModalController) {
    
    this.updateForm = formBuilder.group({
      addressSaved: [this.sellerService.getCurrentSellerAddress()],
      address: [''],
     

    });

    console.log("SELLLER INFO");
    console.log(this.sellerService.getCurrentSeller());
    console.log(this.sellerService.getCurrentSeller().days);

    if (this.sellerService.getCurrentSeller())
    {
      this.nameSaved=this.sellerService.getCurrentSeller().restaurantName;
      this.telNoSaved=this.sellerService.getCurrentSeller().telNo;
      this.descriptionSaved=this.sellerService.getCurrentSeller().description;
      this.descriptionFrSaved=this.sellerService.getCurrentSeller().descriptionFr;
      this.descriptionEnSaved=this.sellerService.getCurrentSeller().descriptionEn;
    }
      
    
  }


  days=["א'","ב'","ג'","ד'","ה'","ו'","ש'"];




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


  updateSellerTime()
  {

  }

  getCategories():any
  {
    return globalConstants.categories;
  }


  getCategoriesNames():any
  {

    return globalConstants.categories.map(data=>data.name);
  }

  ionViewDidLoad() {
    this.updateForm.controls.address.valueChanges.debounceTime(400).subscribe(search => {
      this.setFilteredItems();
  });
 
  }



  showCategoriesChoiceSelect()
  {
    let modalPage=this.modalCtrl.create('ModalSelectPage',{dataList:this.getCategoriesNames()});
    modalPage.present();
    modalPage.onDidDismiss(data=>
      {
        console.log("MODAL DISMMISS");
        console.log(data);
        this.saveInput("category",data.chosen);
      });
  }



  editInput(input:string,bool:boolean)
  {
    this.allInputsShows[input]=bool;
    switch (input) {
      case "category":
      if (bool)
      this.showCategoriesChoiceSelect();
        break;
      case "address":
      if (bool)
        {
          this.addressSelected=false;
          this.searchAddressInput=true;
          
        interval(200).pipe(first())
        .subscribe(x=>
        {
        this.addressInput.setFocus();
      });
      
      }
        else
        {
          this.searchAddressInput=false;
        }
      
        break;
       case "restaurantName":
       if (!bool)
       {
       this.sellerService.getCurrentSeller().restaurantName=this.nameSaved;
      }
      else
      {
        this.nameSaved=this.sellerService.getCurrentSeller().restaurantName;
      }
      break;
      case "description":
      if (!bool)
      {
      this.sellerService.getCurrentSeller().description=this.descriptionSaved;
     
     }
     else
     {
       this.descriptionSaved=this.sellerService.getCurrentSeller().description;
     }
        break;
        case "descriptionFr":
        if (!bool)
        {
        this.sellerService.getCurrentSeller().descriptionFr=this.descriptionFrSaved;
       
       }
       else
       {
         this.descriptionFrSaved=this.sellerService.getCurrentSeller().descriptionFr;
       }
          break;

          case "descriptionEn":
          if (!bool)
          {
          this.sellerService.getCurrentSeller().descriptionEn=this.descriptionEnSaved;
         
         }
         else
         {
           this.descriptionEnSaved=this.sellerService.getCurrentSeller().descriptionEn;
         }
            break;
        case "telNo":
        if (!bool)
        {
        this.sellerService.getCurrentSeller().telNo=this.telNoSaved;
       }
       else
       {
         this.telNoSaved=this.sellerService.getCurrentSeller().telNo;
       }
      break;

      default:
        break;
    }

    

  }

  getHashgahot()
  {
    return globalConstants.hashgahot;
  }
  
  saveInput(name:string,inputValue:any)
  {
   this.editInput(name,false);
  //  this.alertAndLoadingService.showLoading();

  
   
    if (name=="address")
    {
      inputValue=this.addressJSON;
      this.updateForm.controls.addressSaved.setValue(this.addressJSON.description);
    }

    if (name=="hashgaha")
    {
      
      if (inputValue=="ללא")
      {
        inputValue={"כשר":false,"למהדרין":false};
      }
      else if (inputValue=="כשר")
      {
        inputValue={"כשר":true,"למהדרין":false};
      }
      else
      {
        inputValue={"כשר":true,"למהדרין":true};
      }
    }
    
    this.updateUser(name,inputValue);
  }


  updateUser(fieldName:string,field:any)
  {
    this.sellerService.updateCurrentUserField(fieldName,field).then
    (
      (successEvent)=>
      {
      //  this.alertAndLoadingService.dismissLoading();
      }
    )
    .catch(error=>
    {
    //  this.alertAndLoadingService.showToast({message:"Plese check your network connection is active."});
    });
  }

  

 
  searchAddress: string="";
  addresses: Array<any> = [];
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  addressJSON:Address;


    
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
      this.addresses=null;
      return;
    }
    this.lastStringTyped=this.searchAddress;
      this.searching=true;
      this.addressSelected=false;
      this.addresses= await this.addressService.filterItems(this.searchAddress);
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
  
 



  profilePic:Picture;

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
      let sourceType=this.camera.PictureSourceType.PHOTOLIBRARY;
      if (typeChosen=="מצלמה")
      sourceType=this.camera.PictureSourceType.CAMERA;
     
      this.takePicture(sourceType);
      }

      else { 
        this.fileInput.nativeElement.click();
      
      }

    }

    getURL(url:string)
    {
      return 'url(' + url + ')';
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
        this.profilePic=resultPic;
        console.log("UPDATING FIELD PROFILE");
        this.upSvc.deletePicture(this.sellerService.currentSeller.picture);
        this.sellerService.updateCurrentUserField("picture",this.profilePic);    
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


  
  
}
