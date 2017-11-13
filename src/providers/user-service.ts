import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {
  AngularFirestore,
  AngularFirestoreCollection} from 'angularfire2/firestore';
  import { Address } from './address-service';

  import { Subject } from 'rxjs/Subject';

  import { AuthService } from './auth-service';

export interface User {
  email: string;
  restaurantName:string;
  address?:Address;
  description?:string;
  picture?:Picture;
  hashgaha?:string;
  categories?:string;
  enabled?:boolean;
  textCategories?:string;
  products?:any
}

export interface Picture{
  url:string,
  folder:string,
  name:string

 
}

@Injectable()
export class UserService {
  
  usersCollectionRef: AngularFirestoreCollection<User>;
  userID: string=null;
  currentUser:any;
  userStatus:Subject<any>=new Subject<any>();
   
  currentUserObs:Observable<any>=null;
  
  currentDefaultProducts:any=null;
  currentDefaultProductsObs:Observable<any>=null;
  defaultProductsColletionName="defaultProducts";
  

  constructor(private afs: AngularFirestore,public authService:AuthService ) {
    this.usersCollectionRef = this.afs.collection<User>('sellers'); 
   }
  
   public initCurrentUser(userID:string):Observable<any>
  {
    console.log("init with userID:"+userID);
        this.userID=userID;
        this.currentUserObs=this.usersCollectionRef.doc(this.userID).valueChanges();
        this.currentDefaultProductsObs=this.usersCollectionRef.doc(this.userID).collection(this.defaultProductsColletionName).valueChanges();

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
            console.log("CURRENT PRODUCTS");
            console.log(this.currentDefaultProducts);
          });

        return this.userStatus.asObservable().first(data=>data!=null);
  }
  

  public setCurrentUserData(data:any)
  {
    this.currentUser=data;

    let str:string="";
     if ((this.currentUser!=null)&&(this.currentUser.categories!=null))
    {
   
    let i=0;
    Object.keys(this.currentUser.categories).forEach(function(key) {
      if (i!=0)
      str+=",";
      str+=key;
      i++;
    });
  
    this.currentUser.textCategories=str;
    }
  }

   public getCurrentUser():any
  {
    return this.currentUser;
  }
  
  public isCurrentUserEnabled():boolean
  {
    if (this.currentUser==null)
     return false;
    return this.currentUser.enabled==true;
  }

  public isProfileCompleted():boolean
  {
    if (this.currentUser==null)
     return false;
    return this.currentUser.profileCompleted==true;
  }
  
  public createUser(userUID:string, email:string, restaurantName:string):Promise<any>
  {
  
   let user:User={
      email: email,
      restaurantName:restaurantName,
      enabled:false
    };
   console.log("creating user on UID"+userUID);
    
     return new Promise<any>((resolve, reject) => {
      let setUserPromise:Promise<void>=this.usersCollectionRef.doc(userUID).set(user);
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
picture:picture,
hashgaha:hashgaha,
categories:categories,
profileCompleted:true
};
console.log("upadting user on UID"+this.userID);
console.log(userUpdate); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.usersCollectionRef.doc(this.userID).update(userUpdate);
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
  picture: picture,
  key:key
  };

console.log("adding product on UID"+this.userID);
console.log(product); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.usersCollectionRef.doc(this.userID).collection<User>(this.defaultProductsColletionName).doc(key).set(product);
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


public removeDefaultProductFromCurrentUser(product:any):Promise<any>
{

console.log(product); 
return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.usersCollectionRef.doc(this.userID).collection<User>(this.defaultProductsColletionName).doc(product.key).delete().then( ()=>
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
  let setUserPromise:Promise<void>=this.usersCollectionRef.doc(this.userID).collection<User>(this.defaultProductsColletionName).doc(product.key).update(productUpdate);
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
this.currentUser[fieldName]=fieldValue;
console.log("updating user on UID"+this.userID);
console.log(userUpdate); 

return new Promise<any>((resolve, reject) => {
let setUserPromise:Promise<void>=this.usersCollectionRef.doc(this.userID).update(userUpdate);
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

}
