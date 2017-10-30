import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { EmailValidator } from '../../validators/email';
import { OrdersTabPage } from '../orders-tab/orders-tab';
import { LoginTestPage } from '../login-test/login-test';
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
    public alertAndLoadingService: AlertAndLoadingService, public userService:UserService) {
    
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
      
            

  }
  
   loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
         console.log(authData);
         console.log(authData.uid);
         
        this.userService.initCurrentUser(authData.uid).then
        ((dataObs)=>
        {
          dataObs.subscribe(data=>{
          console.log("THE DATA");
          console.log(data);
            console.log("IS CURRENT USER ENABLED?");
            if (this.userService.isCurrentUserEnabled())
            {
            this.navCtrl.setRoot(OrdersTabPage);
            }
            else
            {
              this.authService.logoutUser();
              this.alertAndLoadingService.showAlert({message:"USER IS NOT ENABLED"});
            }
          });
          
        },
        error=>
        {
          this.authService.logoutUser();
          this.alertAndLoadingService.showAlert(error);
        });
        
      }).catch((error) => {
        this.authService.logoutUser();
        this.alertAndLoadingService.showAlert(error);
        
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




}