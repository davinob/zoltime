

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
  AngularFirestoreCollection,
  AngularFirestoreDocument} from 'angularfire2/firestore';
  import { Address } from './address-service';
  
  import * as firebase from 'firebase/app';
  

  import { Subject } from 'rxjs/Subject';

  import { AuthService } from './auth-service';
  import { UploadService,Picture } from './upload-service';
  import { GlobalService } from './global-service';

  import { HttpClient, HttpParams } from '@angular/common/http';
import { provideSettings } from '../../../myTest/src/app/app.module';

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



export interface Product{
  name: string,
  description: string,
  quantity?: number,
  currentQuantity?:number,
  originalPrice: number,
  reducedPrice?: number,
  key:string,
  picture?:Picture,
  uID:string,
  discount?:number
}

export interface Promotion{
  name: string,
  products:{},
  isOneTime:boolean,
  promotionStartTime:string,
  promotionEndTime:string,
  days?:{},
  date?:Date,
  key?:string,
  uID?:string
}

@Injectable()
export class SellerService {
  
  sellersCollectionRef: AngularFirestoreCollection<Seller>;
  productsCollectionRef:firebase.firestore.CollectionReference;
  promotionsCollectionRef:firebase.firestore.CollectionReference;
  currentSeller:Seller;
  userStatus:Subject<any>=new Subject<any>();
   
  currentUserObs:Observable<any>=null;
  
  sellerProducts:Array<any>=[];
  sellerPromotions:Array<any> = [];
  

  
  

  constructor(private afs: AngularFirestore,public authService:AuthService,
    private uploadService:UploadService,private http: HttpClient,
    private globalService:GlobalService) {
        this.sellersCollectionRef = this.afs.collection<Seller>('sellers'); 
        this.productsCollectionRef = this.afs.collection<Product>('products').ref; 
        this.promotionsCollectionRef = this.afs.collection<Product>('promotions').ref; 
   }
  
   public initCurrentUser(userID:string):Observable<any>
  {
    console.log("init with userID:"+userID);
        this.globalService.userID=userID;
        this.uploadService.initBasePath();
        this.currentUserObs=this.sellersCollectionRef.doc(this.globalService.userID).valueChanges();
        
      

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

        this.productsCollectionRef.where("uID", "==", userID).onSnapshot(
          querySnapshot =>
          { 
            let sellerProducts:Array<any>= [];
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc) {
              console.log(doc);
              sellerProducts.push(doc.data());
            });
            this.sellerProducts=sellerProducts;

            console.log("CURRENT PRODUCTS");
            console.log(this.sellerProducts);
          });

          this.promotionsCollectionRef.where("uID", "==", userID).onSnapshot(
            querySnapshot =>
            { 
              console.log("PROMOTIONS COLLECTIONS REF");
              console.log(querySnapshot);
              let sellerPromotions:Array<any> = [];
              console.log(querySnapshot);
              querySnapshot.forEach(function(doc) {
                console.log(doc);
                sellerPromotions.push(doc.data());
              });
              this.sellerPromotions=sellerPromotions;
  
              console.log("CURRENT PROMOTIONS");
              console.log(this.sellerPromotions);
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

  public getSellerProducts():Array<any>
  {
    return this.sellerProducts;
  }


  public getSellerProductsClone():Array<any>
  {
    return Object.assign([], this.sellerProducts);
  }

  public getSellerPromotions():Array<any>
  {
    return this.sellerPromotions;
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
        }, 15001);      
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

console.log("upadting user on UID"+this.globalService.userID);
console.log(userUpdate); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.globalService.userID).update(userUpdate);
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


public addProductToCurrentUser(
  name:string,description:string,
  originalPrice:number,picture:Picture):Promise<any>
{
  let key=new Date().valueOf()+Math.random()+"";

  let product:Product={
  name: name,
  description: description,
  originalPrice: originalPrice,
  key:key,
  uID:this.globalService.userID
  };

  if (picture!=null)
    product.picture=picture;
  else
  product.picture=
  {
    url:"/assets/icon/favicon.ico",
  };

console.log("adding product on UID"+this.globalService.userID);
console.log(product); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<any>=this.productsCollectionRef.doc(key).set(product);
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
}, 15001);      
});

}


public addPromotionToCurrentUser(promotion:Promotion):Promise<any>
{
  let key=new Date().valueOf()+Math.random()+"";
  promotion.key=key;
  promotion.uID=this.globalService.userID;
 

  console.log("MY PROMO:");
  console.log(promotion);

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<any>=this.promotionsCollectionRef.doc(key).set(promotion);
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
}, 15001);      
});

}


public updateCurrentProductQuantity(myProduct:Product,
  quantity:string):Promise<any>
{
  let productUpdate:any={};
  productUpdate["currentQuantity"]=quantity;

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.productsCollectionRef.doc(myProduct.key).update(productUpdate);
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


public updateDefaultProductToCurrentUser(myProduct:Product,
  name:string,description:string,
  quantity:number,originalPrice:number,reducedPrice:number):Promise<any>
{
  let product:Product={
  name: name,
  description: description,
  quantity: quantity,
  currentQuantity:quantity,
  originalPrice: originalPrice,
  reducedPrice: reducedPrice,
  key:myProduct.key,
  picture:myProduct.picture,
  uID:this.globalService.userID
  };

  

console.log("editing product on UID"+this.globalService.userID);
console.log(product); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.productsCollectionRef.doc(myProduct.key).update(product);
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


public removeDefaultProductFromCurrentUser(product:Product):Promise<any>
{

console.log(product); 
return new Promise<any>((resolve, reject) => {
this.uploadService.deletePicture(product.picture);

let setUserPromise:Promise<void>=this.productsCollectionRef.doc(product.key).delete().then( ()=>
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


public removePromotionFromCurrentSeller(promotion:Promotion):Promise<any>
{

console.log(promotion); 
return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.promotionsCollectionRef.doc(promotion.key).delete().then( ()=>
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

public updateCurrentUserDefaultProductField(product:Product,fieldName:any,fieldValue:any):Promise<any>
{

let productUpdate:any={};

productUpdate[fieldName]=fieldValue;

return new Promise<any>((resolve, reject) => {
  let setUserPromise:Promise<void>=this.productsCollectionRef.doc(product.key).update(productUpdate);
  if (fieldName=="picture")
  {
    this.uploadService.deletePicture(product.picture);
  }
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
console.log("updating user on UID"+this.globalService.userID);
console.log(userUpdate); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.sellersCollectionRef.doc(this.globalService.userID).update(userUpdate);
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


timerSubscription:Subscription=null;
promotionMessage:string;






public updateTodayPromotion():Promise<any>
{
  let userUpdate:any={};
  userUpdate["promotionStartDateTime"]=this.currentSeller.promotionStartDateTime;
  userUpdate["promotionEndDateTime"]=this.currentSeller.promotionEndDateTime;
  

  console.log("updating user on UID"+this.globalService.userID);
  console.log(userUpdate); 
  
  return new Promise<any>((resolve, reject) => {
  
    let batch=this.afs.firestore.batch(); 
    let docRef=this.sellersCollectionRef.doc(this.globalService.userID).ref;
    batch.update(docRef,userUpdate);

    this.sellerProducts.forEach(product => {
      console.log("Updating product:");
      console.log(product);
      docRef=this.productsCollectionRef.doc(product.key);
      let prodUpdate:any={};
      prodUpdate["currentQuantity"]=product.quantity;
      console.log(product);
      batch.update(docRef,prodUpdate);
    });
    
    let commit=batch.commit();

    commit.then( ()=>
  {
  console.log("PROMISE DONE");
  }
  ).catch( (error)=>
  {
  console.log(error);
  });
  
  resolve(commit);
  setTimeout( () => {
  reject(new Error("Error inserting the data"));
  }, 150001);      
  });
}

public startTodayPromotion():Promise<any>
{
  console.log("START PROMOTION");
  this.startPromotionTimer();
  return this.updateTodayPromotion();
}

public stopTodayPromotion():Promise<any>
{

  this.currentSeller.promotionStartDateTime=null;
  this.currentSeller.promotionEndDateTime=null;
  this.timerSubscription.unsubscribe();
  this.timerSubscription=null;
  return this.updateTodayPromotion();
}


startPromotionTimer()
{
  console.log("starting timer");
  if (this.timerSubscription!=null)
  return;

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




formT(num:number):string
{
   if (num.toString().length==1)
    return "0"+num;
  return num+"";
}





/*
//readonly START_PROMOTION_URL = 'https://us-central1-zoltime-77973.cloudfunctions.net/startPromotion';
//readonly STOP_PROMOTION_URL = 'https://us-central1-zoltime-77973.cloudfunctions.net/stopPromotion';
public stopTodayPromotion():Promise<any>
{

  this.currentSeller.promotionStartDateTime=null;
  this.currentSeller.promotionEndDateTime=null;
  this.timerSubscription.unsubscribe();

  return new Promise<any>((resolve, reject) => {
    
        let myHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
       let message={userID:this.globalService.userID};
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

public startTodayPromotion():Promise<any>
{
  console.log("START PROMOTION");
  this.startPromotionTimer();

  return new Promise<any>((resolve, reject) => {

    let myHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
    console.log(this.currentSeller.promotionStartDateTime);
    console.log(this.currentSeller.promotionEndDateTime);
    
    let message={userID:this.globalService.userID,
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
}*/
}
