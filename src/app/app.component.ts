import { Component, ViewChild } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';

import { TodayMenuPage } from '../pages/today-menu/today-menu';
import { OrdersTabPage } from '../pages/orders-tab/orders-tab';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../providers/auth-service';
import { UserService } from '../providers/user-service';
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';

import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/first';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  activePage: any;
  
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, authService: AuthService, userService: UserService,
  private storage: Storage ) {
         
         
         authService.isUserLoggedIn().subscribe(user=>
          {
          if (user)
          {
          console.log("USER IS CONNECTED");
          this.rootPage = OrdersTabPage;
          }
        else
        {
          console.log("USER IS NOT CONNECTED");
          this.rootPage = LoginPage;
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
    
      this.platform.ready().then( () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log("Platform is ready");
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
