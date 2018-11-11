import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';


import { HttpModule } from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';

import { AlertAndLoadingService } from '../providers/alert-loading-service';
import { AuthService } from './../providers/auth-service';
import { SellerService } from './../providers/seller-service';
import { AddressService } from './../providers/address-service';
import { UploadService } from './../providers/upload-service';
import { GlobalService } from './../providers/global-service';
import * as fbConfig from './../providers/fbConfig'; 

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as firebase from "firebase";

  // The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

firebase.initializeApp(fbConfig.firebaseConfig);

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp)
    
    
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    SellerService,
    AddressService,
    AlertAndLoadingService,
    Camera,
    UploadService,
    GlobalService
  ]
})
export class AppModule {}


