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

import * as firebase from "firebase";
import { LoginPage } from '../pages/login/login';



firebase.initializeApp(fbConfig.firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
    
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
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


