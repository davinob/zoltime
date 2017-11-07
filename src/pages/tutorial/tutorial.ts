import { Component,ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { OrdersTabPage } from '../orders-tab/orders-tab';

import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Camera } from '@ionic-native/camera';

import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  slides: Slide[];
  showSkip = false;
  dir: string = 'ltr';

  @ViewChild('description') descriptionInput ;
  @ViewChild('address') addressInput ;
  @ViewChild('fileInput') fileInput;

  public signupForm:FormGroup;

  searchAddress: string = '';
  addresses: any;
  
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  
  addressJSON:Address;


  hashgahot:string[]=["Kosher","Lemehadrin","No"];
  categories:string[]=["Italian", "Sandwichs","Israeli", "Boulangerie"];
 
  profilePicURL:string="";


  constructor(public navCtrl: NavController, 
    public menu: MenuController, translate: TranslateService, 
    public platform: Platform,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService,
    public userService: UserService,
    public camera: Camera,
    private upSvc: UploadService) 
  {
    this.dir = platform.dir();
    translate.get(["TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
    ]).subscribe(
      (values) => {
        console.log('Loaded values', values);
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-1.png',
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-2.png',
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-3.png',
          }
        ];
      });


      this.signupForm = formBuilder.group({
        description: [''],
        address: ['', Validators.required],
        picture: [''],
        hashgaha: ['', Validators.required],
        categories: ['', Validators.required]
      });
  }


  startApp() {
    this.navCtrl.setRoot(OrdersTabPage, {}, {
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


  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.signupForm.patchValue({ 'picture': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else { 
      this.fileInput.nativeElement.click();
    
    }
  }

  previousUpload:Upload=null;
  
  processWebImage(event) {
    console.log("PROCESS WEB IMAGE");
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.signupForm.patchValue({ 'picture': imageData });
     };
    console.log(event);
    if ((event.target.files!=null)&&(event.target.files[0]!=null))
     { 
       if(event.target.files[0].type.match('image.*'))
        {
          reader.readAsDataURL(event.target.files[0]);
          if (this.previousUpload!=null)
          {
            this.upSvc.deleteUpload(this.previousUpload);
          }
          let currentUpload = new Upload(event.target.files[0],"profilePic");
          this.previousUpload=currentUpload;
          this.alertAndLoadingService.showLoading();
          this.upSvc.pushUpload(currentUpload).then(
            (result)=>
            {
              this.profilePicURL=result.url;      
               this.alertAndLoadingService.dismissLoading();
            }
          )
        
        }
        else
        this.alertAndLoadingService.showAlert({message:"Please choose an image"});
     }
    
  }

  getProfileImageStyle() {
    return 'url(' + this.signupForm.controls['picture'].value + ')'
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
        let user=this.userService.getCurrentUser();
        console.log("SIGNUP:"+user);
        let jsonCatego:any=this.jsonCatego(this.signupForm.value.categories);
         this.userService.updateCurrentUser(
          this.addressJSON,this.signupForm.value.description,
        this.profilePicURL,this.signupForm.value.hashgaha
        ,jsonCatego)
        .then(()=> {
          this.startApp();
          console.log("Document successfully written!");
          })
        

   
      this.alertAndLoadingService.showLoading();
    }
  }

}
