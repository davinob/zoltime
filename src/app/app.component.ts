import { Component, ViewChild } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TodayMenuPage } from '../pages/today-menu/today-menu';
import { OrdersTabPage } from '../pages/orders-tab/orders-tab';
import { LoginPage } from '../pages/login/login';

import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { AngularFireAuth } from 'angularfire2/auth';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  activePage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, afAuth: AngularFireAuth, public statusBar: StatusBar, 
  public splashScreen: SplashScreen ) {
     const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.rootPage = TodayMenuPage;
        authObserver.unsubscribe();
      } else {
        this.rootPage = LoginPage;
        authObserver.unsubscribe();
      }
    });
    this.initializeApp();
    
  

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'TodayMenu', component: TodayMenuPage },
      { title: 'Orders', component: OrdersTabPage },
      { title: 'Profile Settings', component: ProfileSettingsPage }
    ];
    
    this.activePage=this.pages[0];

  }

  initializeApp() {
    
   
    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage=page;
  }
  
  checkActive(page)
  {
    return page == this.activePage;
  }
  
 
  
}
