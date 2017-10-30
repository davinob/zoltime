import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login-test.html',
})
export class LoginTestPage {
  loading: Loading;
  registerCredentials = { email: '', password: '' };
 
  constructor(private nav: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }
 
  public createAccount() {
    this.nav.push('RegisterPage');
  }
 
  public login() {
  }
 
  showLoading() {
  }
 
  showError(text) {
  }
}