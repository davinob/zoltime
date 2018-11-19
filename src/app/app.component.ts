import { Component, ViewChild } from '@angular/core';
import { Nav} from 'ionic-angular';


import { AuthService } from '../providers/auth-service';
import { SellerService } from '../providers/seller-service';

import 'rxjs/add/operator/first';


import * as firebase from 'firebase/app';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  activePage: any;
  initTime:boolean=true;
  userConnected=false;
  
  pages: Array<{title: string, component: any}>;

  constructor(public authService: AuthService, 
    public sellerService: SellerService ) {

    
  
    
    firebase.auth().onAuthStateChanged(user=>
          {
       
         
         if (user)
          {
          console.log("USER IS CONNECTED");
          this.userConnected=true;
        
        


        
       
          if (this.initTime)
         {
           console.log("REDIRECTING TO SIGNED PAGE")
        
       
           this.sellerService.initCurrentUser(user.uid).subscribe(data=>
          {
            console.log("DATAAA");
            console.log(data);
          if (!data.isOK)
          {
            this.nav.setRoot('LoginPage');
          }
          else
          {

            console.log(data);
            console.log(data.page);
              if (data.page=="ProductsPage")
                this.nav.setRoot("ProductsPage");
             else
                this.nav.setRoot("TutorialPage");
      
              }
          }
          
          );
         
     
        }
        }
        else
        {
          this.userConnected=false;
          console.log("USER IS NOT CONNECTED");
          this.nav.setRoot("LoginPage");
          console.log("Changed to root page");
        }
        this.initTime=false;

      

        });
    
   
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'MY PRODUCTS', component: 'ProductsPage' },
      { title: 'MY PROMOTIONS', component: 'PromotionsPage' },
      { title: 'PROFILE SETTINGS', component: 'ProfileSettingsPage' }
    ];
    
    this.activePage=this.pages[0];
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
  
  logout()
  {
    this.authService.logoutUser();
  }
  
 
  
}
