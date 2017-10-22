import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AuthService } from './../providers/auth-service';

import { MyApp } from './app.component';
import { TodayMenuPage } from '../pages/today-menu/today-menu';

import { OrdersTabPage } from '../pages/orders-tab/orders-tab';
import { OrdersNewPage } from '../pages/orders-new/orders-new';
import { OrdersPendingPage } from '../pages/orders-pending/orders-pending';
import { OrdersCompletedPage } from '../pages/orders-completed/orders-completed';
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { LoginPage } from '../pages/login/login';



import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const firebaseConfig = {
    apiKey: "AIzaSyCjWUCqcYx8lGtAKWI8Q-5H8V1rktUQjJc",
    authDomain: "zoltime-77973.firebaseapp.com",
    databaseURL: "https://zoltime-77973.firebaseio.com",
    projectId: "zoltime-77973",
    storageBucket: "zoltime-77973.appspot.com",
    messagingSenderId: "1026370061265"
  };
  
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
    AngularFireAuthModule
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
    AuthService
  ]
})
export class AppModule {}


