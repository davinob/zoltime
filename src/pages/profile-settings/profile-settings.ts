import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, 
  Loading} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { LoginPage } from '../login/login';
import { UserService, User } from '../../providers/user-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ProfileSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {

  public loading:Loading;

  
  constructor(public navCtrl: NavController, public authData: AuthService, 
  private userService:UserService,  public navParams: NavParams,
  public alertAndLoadingService: AlertAndLoadingService) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileSettingsPage');
  }


 logoutApp()
  {
     this.authData.logoutUser().then( authData => {
     
     this.navCtrl.setRoot(LoginPage);
     });
     
     this.alertAndLoadingService.showLoading();
  }
  
}
