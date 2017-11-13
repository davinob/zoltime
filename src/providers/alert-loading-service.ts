import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController,LoadingController, Loading } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertAndLoadingService {
  
    public loading:Loading;
   
  constructor(public translateService: TranslateService,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
    }
  
  showLoading()
  {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }
  
  dismissLoading()
  {
    this.loading.dismiss();
  }
 
  showAlert(error:any)
  {
    this.translateService.get(error.message).subscribe(
      value => {
        // value is our translated string
        error.message=value;
        if (this.loading!=null)
        {
          this.loading.dismiss().then( () => {
              this.presentAlert(error);
          });
      }
      else
      {
        this.presentAlert(error);
      }
    }
    )
  }
  
  presentAlert(error:any)
  {
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
  }

  presentConfirm(message:any) {

    return new Promise<any>((resolve, reject) => {
      let alert = this.alertCtrl.create({
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              resolve(false);
            }
          },
          {
            text: 'OK',
            handler: () => {
             resolve(true);
            }
          }
        ]
      });
      alert.present();
 
      
  });
  }


  presentPrompt(fieldName:any,fieldValue:any,description:any) {
    return new Promise<any>((resolve, reject) => {
    let alert = this.alertCtrl.create({
      subTitle: "Update "+description,
       inputs: [
        {
          name: fieldName,
          placeholder: fieldName,
          value:fieldValue
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            resolve(data[fieldName]);
          }
        }
      ]
    });
    alert.present();
  });
}
  

}
