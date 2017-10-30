import { Component,ViewChild } from '@angular/core';
import { 
  IonicPage, 
  NavController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import { AddressService,Address } from '../../providers/address-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { LoginPage } from '../login/login';
import { EmailValidator } from '../../validators/email';

import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  @ViewChild('description') descriptionInput ;
  @ViewChild('address') addressInput ;
  
  public signupForm:FormGroup;

  
  searchAddress: string = '';
  addresses: any;
  
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  
  addressJSON:Address;
  
   

  constructor(public nav: NavController, public authService: AuthService, 
    public userService: UserService,
    public formBuilder: FormBuilder,
    public alertAndLoadingService: AlertAndLoadingService,
    public addressService: AddressService) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      name: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      picture: ['', Validators.required],
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
         this.userService.createUser(
          user.uid, user.email, this.signupForm.value.name,this.addressJSON,this.signupForm.value.description,
        this.signupForm.value.picture,this.signupForm.value.hashgaha
        ,this.signupForm.value.categories)
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
        this.addressService.filterItems(this.searchAddress).then((listOfAddresses)=>
        {
           this.searching=false;
           this.addresses=listOfAddresses;
        });
 
    }
    
    addressJustSet:boolean=false;
    
    selectAddress(address:any)
    {
      console.log("SELECT ADDRESS" + address.description);
      this.addresses=null;
      this.searchAddress=address.description;
      this.addressSelected=true;
      
      
      this.addressService.getPosition(address.place_id).then((addressJSON)=>
      {
          console.log(addressJSON);
          this.addressJSON=addressJSON;
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
    
    
}