import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, 
  Loading} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { LoginPage } from '../login/login';
import { UserService, User } from '../../providers/user-service';
import { AlertAndLoadingService } from '../../providers/alert-loading-service';
import { Observable } from 'rxjs/Observable';

import { Camera } from '@ionic-native/camera';

import { UploadService,Upload } from '../../providers/upload-service';
import { AddressService,Address } from '../../providers/address-service';

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

  @ViewChild('fileInput') fileInput;

  public loading:Loading;

  
  constructor(public navCtrl: NavController, public authData: AuthService, 
  private userService:UserService,  public navParams: NavParams,
  public alertAndLoadingService: AlertAndLoadingService,
  public addressService: AddressService,
  public camera: Camera,
  private upSvc: UploadService) {
  
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


  pictureURL:string="";

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
      }, (err) => {
        alert('Unable to take photo');
      })
    } else { 
      this.fileInput.nativeElement.click();
    
    }
  }

  previousUpload:Upload=null;
  
  processWebImage(event) {
    console.log("PROCESS WEB IMAGE");
    let reader = new FileReader();
    console.log(event);
    if ((event.target.files!=null)&&(event.target.files[0]!=null))
     { 
       if(event.target.files[0].type.match('image.*'))
        {
          reader.readAsDataURL(event.target.files[0]);
          if (this.previousUpload!=null)
          {
            this.upSvc.deleteUpload(this.previousUpload);
          }
          let currentUpload = new Upload(event.target.files[0],"profilePic");
          this.previousUpload=currentUpload;
          this.alertAndLoadingService.showLoading();
          this.upSvc.pushUpload(currentUpload).then(
            (result)=>
            {
              this.pictureURL=result.url; 
              console.log("UPDATING FIELD PROFILE");
              this.userService.updateCurrentUserField("pictureURL",this.pictureURL);
               this.alertAndLoadingService.dismissLoading();
            }
          )
        
        }
        else
        this.alertAndLoadingService.showAlert({message:"Please choose an image"});
     }
    
  }


  
  
}
