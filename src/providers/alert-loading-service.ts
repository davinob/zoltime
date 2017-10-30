import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController,LoadingController, Loading } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertAndLoadingService {
  
    public loading:Loading;
   
  constructor(public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
    }
  
  showLoading()
  {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }
  
 
  showAlert(error:any)
  {
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
  }
  
  

}
