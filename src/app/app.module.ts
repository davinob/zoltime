import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AuthService } from './../providers/auth-service';
import { UserService } from './../providers/user-service';
import { AddressService } from './../providers/address-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { TodayMenuPage } from '../pages/today-menu/today-menu';

import { OrdersTabPage } from '../pages/orders-tab/orders-tab';
import { OrdersNewPage } from '../pages/orders-new/orders-new';
import { OrdersPendingPage } from '../pages/orders-pending/orders-pending';
import { OrdersCompletedPage } from '../pages/orders-completed/orders-completed';
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LoginTestPage } from '../pages/login-test/login-test';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HttpModule } from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';
import { AlertAndLoadingService } from '../providers/alert-loading-service';


import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const firebaseConfig = {
    apiKey: "AIzaSyCjWUCqcYx8lGtAKWI8Q-5H8V1rktUQjJc",
    authDomain: "zoltime-77973.firebaseapp.com",
    databaseURL: "https://zoltime-77973.firebaseio.com",
    projectId: "zoltime-77973",
    storageBucket: "zoltime-77973.appspot.com",
    messagingSenderId: "1026370061265"
  };

  // The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
  
@NgModule({
  declarations: [
    MyApp,
    OrdersTabPage,
    OrdersNewPage,
    OrdersPendingPage,
    OrdersCompletedPage,
    ProfileSettingsPage,
    TodayMenuPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TodayMenuPage,
    OrdersTabPage,
    OrdersNewPage,
    OrdersPendingPage,
    OrdersCompletedPage,
    ProfileSettingsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    UserService,
    AddressService,
    AlertAndLoadingService
  ]
})
export class AppModule {}


