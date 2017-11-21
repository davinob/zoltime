import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Subscription } from 'rxjs/Subscription';
import {
  AngularFirestore,
  AngularFirestoreCollection} from 'angularfire2/firestore';
  import { Address } from './address-service';

  import { Subject } from 'rxjs/Subject';

  import { AuthService } from './auth-service';

  import { HttpClient, HttpParams } from '@angular/common/http';

export interface Seller {
  email: string;
  restaurantName:string;
  address?:Address;
  description?:string;
  picture?:Picture;
  hashgaha?:string;
  categories?:string;
  enabled?:boolean;
  textCategories?:string;
  products?:any;
  promotionStartTime?:string;
  promotionEndTime?:string;
  profileCompleted?:boolean;
  promotionStartDateTime?:number;
  promotionEndDateTime?:number;
}

export interface Picture{
  url:string,
  folder:string,
  name:string

 
}

@Injectable()
export class SellerService {
  
  sellersCollectionRef: AngularFirestoreCollection<Seller>;
  userID: string=null;
  currentSeller:Seller;
  userStatus:Subject<any>=new Subject<any>();
   
  currentUserObs:Observable<any>=null;
  
  currentDefaultProducts=null;
  currentDefaultProductsObs:Observable<any>=null;
  defaultProductsColletionName="defaultProducts";
  

  constructor(private afs: AngularFirestore,public authService:AuthService,private http: HttpClient ) {
    this.sellersCollectionRef = this.afs.collection<Seller>('sellers'); 
   }
  
   public initCurrentUser(userID:string):Observable<any>
  {
    console.log("init with userID:"+userID);
        this.userID=userID;
        this.currentUserObs=this.sellersCollectionRef.doc(this.userID).valueChanges();
        this.currentDefaultProductsObs=this.sellersCollectionRef.doc(this.userID).collection(this.defaultProductsColletionName).valueChanges();

       this.currentUserObs.subscribe(data =>
        { 
          this.setCurrentUserData(data);

          console.log("CURRENT USER DATA SUBSCRIBE FROM INIT");
              let isOK:boolean=true;
            console.log("THE DATA");
            console.log(data);
              console.log("IS CURRENT USER ENABLED?");
              let page:string="";
              if (this.isCurrentUserEnabled())
              {
              console.log("USER ENABLED");
                if (this.isProfileCompleted())
                {
                  page="OrdersTabPage";
                }
                else
                {
                  page="TutorialPage";
                }
              
              }
              else
              {
              this.authService.logoutUser();
               isOK=false; 
              }
            this.userStatus.next({isOK:isOK,page:page});
            
         
        });

        this.currentDefaultProductsObs.subscribe(data =>
          { 
            this.currentDefaultProducts=data;
            (<Array<any>>this.currentDefaultProducts).length

            console.log("CURRENT PRODUCTS");
            console.log(this.currentDefaultProducts);
          });

        return this.userStatus.asObservable().first(data=>data!=null);
  }
  

  public setCurrentUserData(data:any)
  {
    this.currentSeller=data;

    let str:string="";
     if ((this.currentSeller!=null)&&(this.currentSeller.categories!=null))
    {
   
    let i=0;
    Object.keys(this.currentSeller.categories).forEach(function(key) {
      if (i!=0)
      str+=",";
      str+=key;
      i++;
    });
  
    this.currentSeller.textCategories=str;
    }
  }

   public getCurrentSeller():Seller
  {
    return this.currentSeller;
  }

  public getCurrentDefaultProducts():any
  {
    return this.currentDefaultProducts;
  }
  
  public isCurrentUserEnabled():boolean
  {
    if (this.currentSeller==null)
     return false;
    return this.currentSeller.enabled==true;
  }

  public isProfileCompleted():boolean
  {
    if (this.currentSeller==null)
     return false;
    return this.currentSeller.profileCompleted==true;
  }
  
  public createUser(userUID:string, email:string, restaurantName:string):Promise<any>
  {
  
   let user:Seller={
      email: email,
      restaurantName:restaurantName,
      enabled:false
    };
   console.log("creating user on UID"+userUID);
    
     return new Promise<any>((resolve, reject) => {
      let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(userUID).set(user);
      console.log("PROMISE launched");
      setUserPromise.then( ()=>
      {
        console.log("PROMISE DONE");
      }
    ).catch( (error)=>
    {
      console.log(error);
    });
       resolve(setUserPromise);
       setTimeout( () => {
        reject(new Error("Error inserting the data"));
        }, 150001);      
  });

}


public updateCurrentUser(address:Address,description:string,
  picture:Picture,hashgaha:string,categories:string):Promise<any>
{

let userUpdate:any={
address:address,
description:description,
hashgaha:hashgaha,
categories:categories,
profileCompleted:true,
promotionStartTime:"18:00",
promotionEndTime:"20:00"
};

if (picture!=null)
userUpdate.picture=picture;
else
userUpdate.picture=
{
url:"/assets/icon/favicon.ico"
};

console.log("upadting user on UID"+this.userID);
console.log(userUpdate); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.userID).update(userUpdate);
console.log("PROMISE launched");
setUserPromise.then( ()=>
{
console.log("PROMISE DONE");
}
).catch( (error)=>
{
console.log(error);
});
resolve(setUserPromise);
setTimeout( () => {
reject(new Error("Error inserting the data"));
}, 150001);      
});

}


public addDefaultProductToCurrentUser(
  name:string,description:string,
  quantity:string,originalPrice:string,reducedPrice:string,picture:Picture):Promise<any>
{
  let key=new Date().valueOf()+Math.random()+"";

  let product:any={
  name: name,
  description: description,
  quantity: quantity,
  originalPrice: originalPrice,
  reducedPrice: reducedPrice,
  key:key
  };

  if (picture!=null)
    product.picture=picture;
  else
  product.picture=
  {
    url:"/assets/icon/favicon.ico"
  };

console.log("adding product on UID"+this.userID);
console.log(product); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.userID).collection<Seller>(this.defaultProductsColletionName).doc(key).set(product);
console.log("PROMISE launched");
setUserPromise.then( ()=>
{
console.log("PROMISE DONE");
resolve(key);
}
).catch( (error)=>
{
console.log(error);
reject(new Error("Error inserting the data"));
});

setTimeout( () => {
reject(new Error("Error inserting the data"));
}, 150001);      
});

}


public updateDefaultProductToCurrentUser(myProduct:any,
  name:string,description:string,
  quantity:string,originalPrice:string,reducedPrice:string):Promise<any>
{
  let product:any={
  name: name,
  description: description,
  quantity: quantity,
  originalPrice: originalPrice,
  reducedPrice: reducedPrice,
  key:myProduct.key,
  picture:myProduct.picture
  };

  

console.log("adding product on UID"+this.userID);
console.log(product); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.userID).collection<Seller>(this.defaultProductsColletionName).doc(myProduct.key).update(product);
console.log("PROMISE launched");
setUserPromise.then( ()=>
{
console.log("PROMISE DONE");
resolve(myProduct.key);
}
).catch( (error)=>
{
console.log(error);
reject(new Error("Error inserting the data"));
});

setTimeout( () => {
reject(new Error("Error inserting the data"));
}, 150001);      
});

}


public removeDefaultProductFromCurrentUser(product:any):Promise<any>
{

console.log(product); 
return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.userID).collection<Seller>(this.defaultProductsColletionName).doc(product.key).delete().then( ()=>
{
console.log("PROMISE DONE");
resolve(setUserPromise);
}
).catch( (error)=>
{
console.log(error);
reject(new Error("Error inserting the data"));
});

setTimeout( () => {
reject(new Error("Error deleting the data"));
}, 150001);      
});

}

public updateCurrentUserDefaultProductField(product:any,fieldName:any,fieldValue:any):Promise<any>
{

let productUpdate:any={};

productUpdate[fieldName]=fieldValue;

return new Promise<any>((resolve, reject) => {
  let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.userID).collection<Seller>(this.defaultProductsColletionName).doc(product.key).update(productUpdate);
console.log("PROMISE launched");
setUserPromise.then( ()=>
{
console.log("PROMISE DONE");
}
).catch( (error)=>
{
console.log(error);
});
resolve(setUserPromise);
setTimeout( () => {
reject(new Error("Error inserting the data"));
}, 15001);      
});

}


public updateCurrentUserField(fieldName:any,fieldValue:any):Promise<any>
{

let userUpdate:any={};
userUpdate[fieldName]=fieldValue;
this.currentSeller[fieldName]=fieldValue;
console.log("updating user on UID"+this.userID);
console.log(userUpdate); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.userID).update(userUpdate);
console.log("PROMISE launched");
setUserPromise.then( ()=>
{
console.log("PROMISE DONE");
}
).catch( (error)=>
{
console.log(error);
});
resolve(setUserPromise);
setTimeout( () => {
reject(new Error("Error inserting the data"));
}, 15001);      
});

}

readonly START_PROMOTION_URL = 'https://us-central1-zoltime-77973.cloudfunctions.net/startPromotion';
readonly STOP_PROMOTION_URL = 'https://us-central1-zoltime-77973.cloudfunctions.net/stopPromotion';
timerSubscription:Subscription;
promotionMessage:string;



public stopTodayPromotion():Promise<any>
{

  this.currentSeller.promotionStartDateTime=null;
  this.currentSeller.promotionEndDateTime=null;
  this.timerSubscription.unsubscribe();

  return new Promise<any>((resolve, reject) => {
    
        let myHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
       let message={userID:this.userID};
        console.log("STOP PROMOTION!!");
        console.log(message);
        let obsPost=this.http.post(this.STOP_PROMOTION_URL,message,{headers:myHeaders}).subscribe(
          data => {
          //  alert('ok');
          },
          error => {
            console.log(error);
          }
        );
    
        resolve(obsPost);
     
      });


}


startPromotionTimer()
{
  this.timerSubscription=Observable.timer(0,1000).
  subscribe(
    ()=>
    {
    let nowDate=new Date();
      let promotionHasStarted=false;
      

      let timeDiffInSecBeforeStart=Math.round(new Date(this.currentSeller.promotionStartDateTime-nowDate.valueOf()).valueOf()/1000);
      let timeDiffInSec=timeDiffInSecBeforeStart;
      if (timeDiffInSecBeforeStart<=0)
      {
        promotionHasStarted=true;
        timeDiffInSec=Math.round(new Date(this.currentSeller.promotionEndDateTime-nowDate.valueOf()).valueOf()/1000);
        if (timeDiffInSec<0)
        {
          this.stopTodayPromotion();
          return;
        }
          
      }

      let secondsDiff=timeDiffInSec%(60);
      timeDiffInSec-=secondsDiff;
      
      let timeDiffInMin=timeDiffInSec/60;
      let minutesDiff=(timeDiffInMin)%60;
      timeDiffInMin-=minutesDiff;
      let hoursDiff=timeDiffInMin/60;

    
      if (promotionHasStarted)
      {
        this.promotionMessage= "Promotion ends in: "+this.formT(hoursDiff)+":"+this.formT(minutesDiff)+":"+this.formT(secondsDiff);
      }
      else
      {
        this.promotionMessage= "Promotion starts in: "+this.formT(hoursDiff)+":"+this.formT(minutesDiff)+":"+this.formT(secondsDiff);
      }
      
    
  }
  );
}

public startTodayPromotion():Promise<any>
{
  console.log("START PROMOTION");
  this.startPromotionTimer();

  return new Promise<any>((resolve, reject) => {

    let myHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
    console.log(this.currentSeller.promotionStartDateTime);
    console.log(this.currentSeller.promotionEndDateTime);
    
    let message={userID:this.userID,
                startDateTime: this.currentSeller.promotionStartDateTime+"",
                 endDateTime: this.currentSeller.promotionEndDateTime+"" };
    console.log("START PROMOTION!!");
    console.log(message);
    let obsPost=this.http.post(this.START_PROMOTION_URL,message,{headers:myHeaders}).subscribe(
      data => {
        //alert('ok');
      },
      error => {
        console.log(error);
      }
    );

    resolve(obsPost);
 
  });
}


formT(num:number):string
{
   if (num.toString().length==1)
    return "0"+num;
  return num+"";
}


}
