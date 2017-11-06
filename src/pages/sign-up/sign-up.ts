import { Component,ViewChild } from '@angular/core';
import { 
  IonicPage, 
  NavController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import { AddressService,Address } from '../../providers/address-service';
import { UploadService,Upload } from '../../providers/upload-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { LoginPage } from '../login/login';
import { EmailValidator } from '../../validators/email';
import { Camera } from '@ionic-native/camera';

import 'rxjs/add/operator/debounceTime';



 

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
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
 

  constructor(public nav: NavController, public authService: AuthService, 
    public userService: UserService,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService,
    public camera: Camera,
    private upSvc: UploadService) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      name: ['', Validators.required],
      description: [''],
      address: ['', Validators.required],
      picture: [''],
      hashgaha: ['', Validators.required],
      categories: ['', Validators.required]
    });
    
    
    
    
  }

  signupUser(){
    if (!this.signupForm.valid){
      console.log("FORM INVALID"+this.signupForm.value);
    } else {
      this.authService.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(user => {
        console.log("LOGOUT:"+user);
        this.authService.logoutUser().then(()=>
        {
        console.log("SIGNUP:"+user);
        let jsonCatego:any=this.jsonCatego(this.signupForm.value.categories);
         this.userService.createUser(
          user.uid, user.email, this.signupForm.value.name,this.addressJSON,this.signupForm.value.description,
        this.signupForm.value.picture,this.signupForm.value.hashgaha
        ,jsonCatego)
        .then(()=> {
          this.nav.setRoot(LoginPage);
          console.log("Document successfully written!");
          })
          .catch((error)=> {
            this.alertAndLoadingService.showAlert(error);
          });
        });
      }).catch((error) => {
        this.alertAndLoadingService.showAlert(error);
       
      });

   
      this.alertAndLoadingService.showLoading();
    }
  }
  
 
  jsonCatego(arr:string[]):any
  {
    let myCategos:any=<any>{};
      arr.forEach(element => {
        myCategos[element]=true;
      });

    return myCategos;
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
            let currentUpload = new Upload(event.target.files[0]);
            this.previousUpload=currentUpload;
            this.upSvc.pushUpload(currentUpload);
          
          }
          else
          this.alertAndLoadingService.showAlert({message:"Please choose an image"});
       }
      
    }
  
    getProfileImageStyle() {
      return 'url(' + this.signupForm.controls['picture'].value + ')'
    }
  
    
}