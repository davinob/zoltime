import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, 
  Loading} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController, public authData: AuthService, public navParams: NavParams,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileSettingsPage');
  }


 logoutApp()
  {
     this.authData.logoutUser().then( authData => {
     
     this.navCtrl.setRoot(LoginPage);
     });
     
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
  }
  
}
