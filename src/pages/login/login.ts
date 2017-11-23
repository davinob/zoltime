import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { SellerService } from '../../providers/seller-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { EmailValidator } from '../../validators/email';
import { OrdersTabPage } from '../orders-tab/orders-tab';
import { LoginTestPage } from '../login-test/login-test';
import { TutorialPage } from '../tutorial/tutorial';
import 'rxjs/add/operator/map';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  
  public loginForm:FormGroup;
  
  public errorMessages:any[];
  
  constructor(public navCtrl: NavController, public authService: AuthService, 
    public formBuilder: FormBuilder, 
    public alertAndLoadingService: AlertAndLoadingService, public sellerService:SellerService) {
    
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
      
            

  }
  
   loginUser(){
     console.log("LOGIN CALLLED");
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
         console.log(authData);
         console.log(authData.uid);
        this.sellerService.initCurrentUser(authData.uid).subscribe(data=>
          {
            console.log(data);
          if (!data.isOK)
          {
            this.alertAndLoadingService.showAlert({message:"User is not enabled. In order to activate it, please contact us at: zoltimeapp@gmail.com"});
          }
          else
          {
             this.navCtrl.setRoot(data.page);
          }

          });
        }).catch((error) => {
        this.authService.logoutUser();
        this.alertAndLoadingService.showToast(error);
        
      });

    this.alertAndLoadingService.showLoading();
    }
  }

  goToResetPassword(){
    this.navCtrl.push('ResetPasswordPage');
  }

  createAccount(){
    this.navCtrl.push('SignUpPage');
  }
  
   createLoginTest(){
    this.navCtrl.push('LoginTestPage');
  }


  test()
  {
    this.alertAndLoadingService.showAlert({message:"BAD ERROR"});
  }


}