import { Component,ViewChild } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import { AddressService,Address } from '../../providers/address-service';
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
  public loading:Loading;
  
  searchAddress: string = '';
  addresses: any;
  
  shouldShowAddresses:boolean;
  searching:boolean=false;
  addressSelected:boolean=false;
  
  addressJSON:Address;

  constructor(public nav: NavController, public authService: AuthService, 
    public userService: UserService,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
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
        console.log("SIGNUP:"+user);
        this.userService.createUser(
          user.uid, user.email, this.signupForm.value.name,this.addressJSON,this.signupForm.value.description,
                    this.signupForm.value.picture,this.signupForm.value.hashgaha,this.signupForm.value.categories);
        this.authService.logoutUser();
        
        this.nav.setRoot(LoginPage);
      }, (error) => {
        console.log("SIGNUP ERROR:"+error);
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }
  
  
   ionViewDidLoad() {
     
      this.signupForm.controls.address.valueChanges.debounceTime(700).subscribe(search => {
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
        
      this.descriptionInput.setFocus();
      
    }
    
   
    
    showAddresses(toShow:boolean)
    {
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