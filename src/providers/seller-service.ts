

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
  key:string;
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
  discount?:number,
  enabled?:boolean,
  isPreviouslyChosen?:boolean
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
  uID?:string,
  isActivated:boolean
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
      enabled:false,
      key:userUID
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
resolve(setUserPromise);
}
).catch( (error)=>
{
console.log(error);
reject(new Error("Error inserting the data"));
});
    
});

}


public updatePromotionToCurrentUser(promotion:Promotion):Promise<any>
{
  console.log("MY PROMO:");
  console.log(promotion);

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<any>=this.promotionsCollectionRef.doc(promotion.key).update(promotion);
console.log("PROMISE launched");
setUserPromise.then( ()=>
{
console.log("PROMISE DONE");
resolve(setUserPromise);
}
).catch( (error)=>
{
console.log(error);
reject(new Error("Error inserting the data"));
});

      
});

}



public updateDefaultProductToCurrentUser(myProduct:Product,
  name:string,description:string,
  originalPrice:number):Promise<any>
{
  let product:Product={
  name: name,
  description: description,
  originalPrice: originalPrice,
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

   
});

}

public updateCurrentUserDefaultProductField(product:Product,fieldName:any,fieldValue:any):Promise<any>
{

let productUpdate:any={};

productUpdate[fieldName]=fieldValue;
console.log("updateCurrentUserDefaultProductField");
console.log(product);

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
      
});

}





promoMessages:Array<any>=[];


initPromotionMessage(promo:Promotion):boolean
{

      let nowDate=new Date();
      let promotionHasStarted=false;
      let datesCalculated=this.calculatePromoStartEndDates(promo,false);
      let startDate=datesCalculated.startDate;
      let endDate=datesCalculated.endDate;

     
      let timeDiffInSecBeforeStart=Math.round((startDate.valueOf()-nowDate.valueOf())/1000);
      let timeDiffInSec=timeDiffInSecBeforeStart;
      if (timeDiffInSecBeforeStart<=0)
      {
        promotionHasStarted=true;
        timeDiffInSec=Math.round( (endDate.valueOf()-nowDate.valueOf())/1000);
        
        if (timeDiffInSec<0)
        {
          this.promoMessages[promo.key]= {message:"Promotion is expired",isExpired:true};
          return true;
        }
          
      }

      if (!promo.isActivated)
      {
        this.promoMessages[promo.key]={message:"",isExpired:false}
        return false;
      }



      let secondsDiff=timeDiffInSec%(60);
      timeDiffInSec-=secondsDiff;
      let timeDiffInMin=timeDiffInSec/60;
      let minutesDiff=(timeDiffInMin)%60;
      timeDiffInMin-=minutesDiff;
      let timeDiffInHours=timeDiffInMin/60;
      let hoursDiff=timeDiffInHours%24;
      timeDiffInHours-=hoursDiff;
      let daysDiff=timeDiffInHours/24;

   
    
      let promoMessage={message:"",isExpired:false};
      if (promotionHasStarted)
      {
        promoMessage.message+=" Ends in: ";
      }
      else
      {
        promoMessage.message+=" Starts in: ";
      }

      if (daysDiff!=0)
      {
        promoMessage.message+=daysDiff+ " day(s) ";
      }

      promoMessage.message+=this.formT(hoursDiff)+":"+this.formT(minutesDiff);//+":"+this.formT(secondsDiff);
      
      this.promoMessages[promo.key]=promoMessage;

      return true;

}

getPromotionMessage(promo:Promotion):string
{
 if (this.promoMessages[promo.key]==null)
  return "";
  return this.promoMessages[promo.key].message;
}

isPromotionExpired(promo:Promotion):boolean
{
  if (this.promoMessages[promo.key]==null)
  return false;
  return this.promoMessages[promo.key].isExpired;
}


public startPromotion(promo:Promotion)
{
  promo.isActivated=true;
   this.updatePromotionToCurrentUser(promo);
}

public stopPromotion(promo:Promotion)
{
  promo.isActivated=false;
  this.updatePromotionToCurrentUser(promo);
 
}


 
calculatePromoStartEndDates(promo:Promotion, checkForNext:boolean):any
{


  console.log(promo);
  let nowDate=new Date();

  let startDate:Date;
  let endDate:Date;

  let startH=Number.parseInt(promo.promotionStartTime.substr(0,2));
  let startM=Number.parseInt(promo.promotionStartTime.substr(3,2));

   
  let endH=Number.parseInt(promo.promotionEndTime.substr(0,2));
  let endM=Number.parseInt(promo.promotionEndTime.substr(3,2));

  if (!promo.isOneTime)
  {

    let daysToAddToToday=-1;


    if (((startH>endH)||((startH==endH)&&((startM>endM)))) //promotion not in same day
      && 
      ((nowDate.getHours()<startH)||((nowDate.getHours()==startH)&&((nowDate.getMinutes()<startM))))
      )
    {
      console.log("HERE 1");
      nowDate=new Date(nowDate.valueOf()-(1000 * 60 * 60 * 24))
    }

    let nowD:number=nowDate.getDay();
    console.log("nowD"+nowD);
    let i=-1;
    
    if (checkForNext)
    {
      console.log("HERE 2");
      i=0;
    }

    
 
   
    while (i<=7 && daysToAddToToday==-1)
    {
      console.log(i);
      console.log((nowD+i)%7+1);
      console.log(promo.days[(nowD+i)%7+1]);
      if (promo.days[(nowD+i)%7+1])
      {
        console.log("HERE 3");
        daysToAddToToday=i+1;
        console.log(daysToAddToToday);
      }
      i++;
    }
  
    startDate=new Date(nowDate.valueOf()+(daysToAddToToday*1000 * 60 * 60 * 24));
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    endDate=new Date(startDate);

  }
  else
  {
    startDate=new Date(promo.date);
    endDate=new Date(promo.date);
  }
    
   
    startDate.setHours(startH);
    startDate.setMinutes(startM);
  
  
   endDate.setHours(endH);
   endDate.setMinutes(endM);
  
  if ((startH>endH)||((startH==endH)&&((startM>endM)))) //promotion not in same day
  {
   
    endDate=new Date(endDate.valueOf()+(1000 * 60 * 60 * 24));
   
  }

  if ((!promo.isOneTime)&&(!checkForNext)&&(Math.round( endDate.valueOf()-nowDate.valueOf())<0))
      return this.calculatePromoStartEndDates(promo,true);
    
  
  
      console.log("DATE RETURNED");
      console.log({startDate:startDate,endDate:endDate});

  return {startDate:startDate,endDate:endDate};
  
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
