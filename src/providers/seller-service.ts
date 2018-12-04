

import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { timer } from 'rxjs';

  import { Address } from './address-service';
  
  import * as firebase from 'firebase/app';

 
  import { Subject } from 'rxjs/Subject';

  import { AuthService } from './auth-service';
  import { UploadService,Picture } from './upload-service';
  import { GlobalService } from './global-service';



import * as globalConstants from './../providers/globalConstants'; 


export interface Seller {
  email: string;
  restaurantName:string;
  address?:Address;
  description?:string;
  telNo?:string;
  picture?:Picture;
  hashgaha?:string;
  category?:string;
  enabled?:boolean;
  textHashgaha?:string;
  products?:any;
  promotions?:any;
  profileCompleted?:boolean;
  key:string;
  days?:Array<any>
}



export interface Product{
  name: string,
  description: string,
  category: string,
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
  date?:any,
  key?:string,
  uID?:string,
  isActivated:boolean
}

@Injectable()
export class SellerService {
  
  sellersCollectionRef: firebase.firestore.CollectionReference;
  productsCollectionRef:firebase.firestore.CollectionReference;
  promotionsCollectionRef:firebase.firestore.CollectionReference;
  currentSeller:Seller;
  userStatus:Subject<any>=new Subject<any>();
   
  
  doneLookingForProductsCompleteValue:boolean=false;
  
  sellerProductsGroupedByCatego:{};
  
 
  db=firebase.firestore();
  

  constructor(public authService:AuthService,
    private uploadService:UploadService,
    private globalService:GlobalService) {

     
      const settings = {timestampsInSnapshots: true};
      this.db.settings(settings);

  
        this.sellersCollectionRef = this.db.collection('sellers'); 
      
   }
  
   doneLookingForProducts:Subject<boolean>=new Subject();

   inititateSellerDays():Array<any>
   {
     let arr=new Array();
     for(let i=0;i<7;i++)
     {
      arr.push({startTime:"08:00",endTime:"20:00"});
     }
     return arr;
   }

   public initCurrentUser(userID:string):Observable<any>
  {
    console.log("init with userID:"+userID);

    this.productsCollectionRef = this.sellersCollectionRef.doc(userID).collection("products");
    this.promotionsCollectionRef = this.sellersCollectionRef.doc(userID).collection("promotions");

        this.globalService.userID=userID;
        this.uploadService.initBasePath();
        this.sellersCollectionRef.doc(this.globalService.userID).onSnapshot(seller =>
        {
          let isOK:boolean=true;

          if (!seller || !seller.exists)
          {
            this.authService.logoutUser();
            isOK=false; 
            return;
          }

      
      
          console.log(seller.data());

          this.setCurrentUserGeneralData(seller.data());

          console.log("CURRENT USER DATA SUBSCRIBE FROM INIT");
             
            console.log("THE DATA");
            
              console.log("IS CURRENT USER ENABLED?");
              let page:string="";
              if (this.isCurrentUserEnabled())
              {
              console.log("USER ENABLED");
                if (this.isProfileCompleted())
                {
                  page="ProductsPage";
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
            

         

            console.log("CURRENT PRODUCTS");
            console.log(this.currentSeller.products);
            if ((!this.currentSeller.days)||(this.currentSeller.days.length!=7))
            {
              this.currentSeller.days=this.inititateSellerDays();
            }
         

            this.productsCollectionRef.onSnapshot(snapshot =>
              { 
                this.currentSeller.products=new Array();
                console.log("PRODUCTS");
                console.log(snapshot);
                snapshot.forEach(product=>{
                  this.currentSeller.products.push(product.data());
                });
                console.log(this.currentSeller.products);
                this.sellerProductsGroupedByCatego=this.caculateProductsGroupedByCategory();
                console.log("DONE LOOKING FOR PRODS");
                this.doneLookingForProducts.next(true);
                this.doneLookingForProductsCompleteValue=true;
              });
    
              this.promotionsCollectionRef.onSnapshot(snapshot =>
                { 
                  this.currentSeller.promotions=new Array();
                  console.log("PRODUCTS");
                  console.log(snapshot);
                  snapshot.forEach(promotion=>{
                    this.currentSeller.promotions.push(promotion.data());
                  });
                  console.log(this.currentSeller.promotions);
                  this.doneLookingForProducts.next(true);
                  this.doneLookingForProductsCompleteValue=true;
                  
                });


        });

    

   

        return this.userStatus.asObservable().first(data=>data!=null);
  }
  

  public setCurrentUserGeneralData(data:any)
  {
    this.currentSeller=data;
    
    this.currentSeller.textHashgaha="ללא";
    if ((this.currentSeller!=null)&&(this.currentSeller.hashgaha!=null))
    {
      if (this.currentSeller.hashgaha["כשר"])
      this.currentSeller.textHashgaha="כשר";

      if (this.currentSeller.hashgaha["למהדרין"])
      this.currentSeller.textHashgaha="למהדרין";
   }

  }

  

   public getCurrentSeller():Seller
  {
    return this.currentSeller;
  }

  public getCurrentSellerAddress():string
  {
    if (this.currentSeller)
    return this.currentSeller.address.description;

    else return "";
  }



  public getSellerProducts():Array<any>
  {

    return this.currentSeller.products;
  }

 
  public getSellerProductsCategories():Array<any>
  {
    console.log(this.sellerProductsGroupedByCatego);
    if (!this.sellerProductsGroupedByCatego)
      return new Array();

    return Object.keys(this.sellerProductsGroupedByCatego);
  }

  public getCategoryProducts(catego:string):Array<any>
  {
    return this.sellerProductsGroupedByCatego[catego];
  }

  public caculateProductsGroupedByCategory():{}
  {
    let productsPerCategos={};
    
    if (!this.currentSeller.products)
      return {};

    this.currentSeller.products.forEach(
      product=>{
        if (productsPerCategos[product.category])
        {
        (<Array<any>>productsPerCategos[product.category]).push(product);
        }
        else
        {
          productsPerCategos[product.category]=[product];
        }
    });
    
    return productsPerCategos;
  }


  public getSellerProductsClone():Array<any>
  {
    return Object.assign([], this.currentSeller.products);
  }

  public getSellerPromotions():Array<any>
  {
    if (!this.currentSeller.promotions)
     this.currentSeller.promotions=new Array();
    return this.currentSeller.promotions;
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
      key:userUID,
      days:this.inititateSellerDays()
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


public updateCurrentUser(address:Address,description:string,telNo:string,
  picture:Picture,hashgaha:string,category:string,days:Array<any>):Promise<any>
{

let userUpdate:any={
address:address,
description:description,
telNo:telNo,
hashgaha:hashgaha,
category:category,
profileCompleted:true,
days:days

};

if (picture!=null)
userUpdate.picture=picture;
else
userUpdate.picture=
{
url:"assets/icon/favicon.ico"
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
  originalPrice:number,picture:Picture, category:string):Promise<any>
{
  let key=new Date().valueOf()+Math.random()+"";

  let product:Product={
  name: name,
  description: description,
  category:category,
  originalPrice: originalPrice,
  key:key,
  discount:50,
  reducedPrice:Math.round(100*50*originalPrice/100)/100,
  quantity:10,
  uID:this.globalService.userID
  };

  if (picture!=null)
    product.picture=picture;
  else
  product.picture=
  {
    url:"assets/icon/food.png",
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

public getProductCategoriesChoices():Set<string>
{
  let set:Set<string>=new Set();
 

  globalConstants.categories.filter(
    categoVal=>
    {
     
      
      return this.getCurrentSeller().category==categoVal.name;
    }
  ).forEach(
    val=>{
      if (val)
    {
     // console.log(val);
      val.subCategories.forEach(subCatego=>
      {
      set.add(subCatego);
      })
      
    }
}

  );
//  console.log(set);
  return set;
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
  originalPrice:number, category:string):Promise<any>
{
  let product:Product={
  name: name,
  description: description,
  originalPrice: originalPrice,
  category:category,
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

return new Promise<any>((resolve) => {
  let setUserPromise:Promise<void>=this.productsCollectionRef.doc(product.key).update(productUpdate);

  console.log("PIC UPDATING SOON");
  if (fieldName=="picture")
  {
    console.log("DELETING PICTURE?");
    console.log(product.picture);

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



return new Promise<any>((resolve) => {
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



initPromotionMessages()
{
  console.log("initPromotionMessages");
  timer(0,60000).subscribe(()=>
  {
    console.log("timer is on");
   
        this.getSellerPromotions().forEach(promo=>
     {
      this.calculatePromotionMessage(promo);
      });
  
  });


}


calculatePromotionMessage(promo:Promotion):boolean
{


      let nowDate=new Date();
      let promotionHasStarted=false;
      let datesCalculated=this.calculatePromoStartEndDates(promo,false);
      let startDate:Date=datesCalculated.startDate;
      let endDate:Date=datesCalculated.endDate;

     
      let timeDiffInSecBeforeStart=Math.round((startDate.valueOf()-nowDate.valueOf())/1000);
      let timeDiffInSec=timeDiffInSecBeforeStart;
      if (timeDiffInSecBeforeStart<=0)
      {
        promotionHasStarted=true;
        timeDiffInSec=Math.round( (endDate.valueOf()-nowDate.valueOf())/1000);
        
        if (timeDiffInSec<0)
        {
          this.promoMessages[promo.key]= {message:"המבצע הסתיים",isExpired:true};
          return true;
        }
          
      }

      if (!promo.isActivated)
      {
        this.promoMessages[promo.key]={message:"",isExpired:false}
        return false;
      }

      var optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      let promoMessage={message:"",isExpired:false};
      if (promotionHasStarted)
      {
        promoMessage.message+="המבצע הנוכחי מסתיים  ";
        if ((endDate.getDate()==nowDate.getDate())
          &&(endDate.getMonth()==nowDate.getMonth())
          &&(endDate.getFullYear()==nowDate.getFullYear()))
          promoMessage.message+="היום";
        else
        promoMessage.message+=endDate.toLocaleDateString("he-IL",optionsDate);

        promoMessage.message+=" ב"+this.formT(endDate.getHours())+":"+this.formT(endDate.getMinutes());
      }
      else
      {
        promoMessage.message+="המבצע הבא מתחיל  ";
        if ((startDate.getDate()==nowDate.getDate())
        &&(startDate.getMonth()==nowDate.getMonth())
        &&(startDate.getFullYear()==nowDate.getFullYear()))
          promoMessage.message+="היום";
        else
        promoMessage.message+=startDate.toLocaleDateString("he-IL",optionsDate);

        promoMessage.message+=" ב"+this.formT(startDate.getHours())+":"+this.formT(startDate.getMinutes());
      }

    
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

    console.log("startH"+startH);
    console.log("endH"+endH);
    console.log("startM"+startM);
    console.log("endM"+endM);
    console.log("getHours"+nowDate.getHours());
    console.log("getMinutes"+nowDate.getMinutes());

    if (((startH>endH)||((startH==endH)&&((startM>endM)))) //promotion not in same day
      && 
      ((nowDate.getHours()<endH)||((nowDate.getHours()==endH)&&((nowDate.getMinutes()<endH))))
      )
    {
      console.log("HERE 1");
      nowDate=new Date(nowDate.valueOf()-(1000 * 60 * 60 * 24))
    }

    let nowD:number=nowDate.getDay()+7; //on sunday it returns 0, so adding 7
    console.log("nowD"+nowD);
    let i=-1;
    
    if (checkForNext)
    {
      console.log("HERE 2");
      i=0;
    }

    
 
    console.log(promo.days);
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
    let promoDate=promo.date
    if (!(promo.date instanceof Date))
    {
      promoDate=promoDate.toDate();
    }
    startDate=new Date(promoDate);
    endDate=new Date(promoDate);
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
