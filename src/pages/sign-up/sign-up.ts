import { Component,ViewChild } from '@angular/core';
import { 
  IonicPage, 
  NavController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { LoginPage } from '../login/login';
import { EmailValidator } from '../../validators/email';
import { SellerService } from '../../providers/seller-service';

 

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
 
  
  public signupForm:FormGroup;

  constructor(public nav: NavController, public authService: AuthService, 
    public formBuilder: FormBuilder,
    public sellerService: SellerService,
    public alertAndLoadingService: AlertAndLoadingService,

    ) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      name: ['', Validators.required],
     });
    
    
    
    
  }

  async signupUser(){
    if (!this.signupForm.valid){
      console.log("FORM INVALID"+this.signupForm.value);
    } else {
      this.alertAndLoadingService.showLoading();
      let user= await this.authService.signupUser(this.signupForm.value.email, this.signupForm.value.password);
      
      await this.sellerService.createUser(user.uid, user.email, this.signupForm.value.name);

       await  this.authService.logoutUser();
        this.nav.setRoot(LoginPage);
     
      }

   
      
    }
  
  
 

  
  
  
 
   
    
    
  
    
}