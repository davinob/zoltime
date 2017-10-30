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


export interface User {
  email: string;
  restaurantName:string;
  address:Address;
  description:string;
  pictureURL:string;
  hashgaha:string;
  categories:string;
  enabled:boolean
}

@Injectable()
export class UserService {
  
  usersCollectionRef: AngularFirestoreCollection<User>;
  userID: string=null;
  currentUser:any=null;
  currentUserObs:Observable<any>=null;

  constructor(private afs: AngularFirestore) {
    this.usersCollectionRef = this.afs.collection<User>('users');  
   }
  
   public initCurrentUser(userID:string):Observable<any>
  {
    console.log("init with userID:"+userID);
        this.userID=userID;
        this.currentUserObs=this.usersCollectionRef.doc(this.userID).valueChanges();

        this.currentUserObs.subscribe(data =>
        { 
          this.currentUser=data;
          console.log("CURRENT USER DATA SUBSCRIBE FROM INIT");
          console.log(this.currentUser);
        });
     
        console.log("resolving promise");
        return this.currentUserObs.first(data=>data!=null);
  }
  
   public getCurrentUser():any
  {
    console.log("this USER ID: "+this.userID);
    console.log("this USER: ");
    console.log(this.currentUser);
    return this.currentUser;
  }
  
  public isCurrentUserEnabled():boolean
  {
    if (this.currentUser==null)
     return false;
    return this.currentUser.enabled==true;
  }
  
  public createUser(userUID:string, email:string, restaurantName:string,address:Address,description:string,
                    pictureURL:string,hashgaha:string,categories:string):Promise<any>
  {
  
   let user:User={
      email: email,
      restaurantName:restaurantName,
      address:address,
      description:description,
      pictureURL:pictureURL,
      hashgaha:hashgaha,
      categories:categories,
      enabled:false
    };
   console.log("creating user on UID"+userUID);
    console.log(user); 
    this.usersCollectionRef.doc(userUID).set(user);

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


}
