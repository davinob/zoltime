import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController,LoadingController, Loading } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
 
import { Subject } from 'rxjs/Subject';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertAndLoadingService {
  
    public loading:Loading;
   
  constructor(public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,public toastCtrl:ToastController
     ) {  }
  

   
    
   
    
 


  showLoading()
  {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true      
    });
    this.loading.present();
  }
  
  dismissLoading()
  {
    this.loading.dismiss();
  }
 
  showAlert(error:any)
  {
 
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


  showToast(error:any)
  {
   
        if (this.loading!=null)
        {
          this.loading.dismiss().then( () => {
              this.presentToast(error);
          });
      }
      else
      {
        this.presentToast(error);
      }
  
  }
  
  presentToast(error:any)
  {
    var errorMessage: string = error.message;
    let toast = this.toastCtrl.create({
      message: errorMessage,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

 

  showChoice(message:any,choice1:string,choice2:string):Promise<any>
  {
    return new Promise<any>((resolve, reject) => {

  
        if (this.loading!=null)
        {
          this.loading.dismiss().then( () => {
              resolve(this.presentChoice(message,choice1,choice2));
          });
      }
      else
      {
        resolve(this.presentChoice(message,choice1,choice2));
      }
     

  });

 

}


  presentChoice(message:any,choice1:string,choice2:string):Promise<any> {
    return new Promise<any>((resolve, reject) => {
       let alert = this.alertCtrl.create({
            message: message,
            buttons: [
              {
                text: choice1,
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                  resolve(false);
                }
              },
              {
                text: choice2,
                handler: () => {
                 resolve(true);
                }
              }
            ]
          });

          alert.present();
        });
      }



  presentConfirm(message:any):Promise<any> {

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

