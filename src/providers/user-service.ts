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
}

@Injectable()
export class UserService {
  
  usersCollectionRef: AngularFirestoreCollection<User>;
  user$: Observable<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollectionRef = this.afs.collection<User>('users');  
  }
  
  public setCurrentUser(userID: string)
  {
    this.user$=this.usersCollectionRef.doc(userID).valueChanges();
  }
  
  public getCurrentUser():Observable<User>
  {
    if (this.user$==null)
      return Observable.of(null);
    
    return this.user$;
  }
  
  public createUser(userUID:string, email:string, restaurantName:string,address:Address,description:string,
                    pictureURL:string,hashgaha:string,categories:string)
  {
    
   let user:User={
      email: email,
      restaurantName:restaurantName,
      address:address,
      description:description,
      pictureURL:pictureURL,
      hashgaha:hashgaha,
      categories:categories
    };
   console.log("creating user");
    console.log(user); 
    this.usersCollectionRef.doc(userUID).set(user);
  }

}
