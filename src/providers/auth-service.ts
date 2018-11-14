import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';



@Injectable()
export class AuthService {
  

  constructor() { 

   }
  

  
  loginUser(newEmail: string, newPassword: string): Promise<any> {
  return firebase.auth().signInWithEmailAndPassword(newEmail, newPassword).then(auth=>{return auth.user});
  }
  
  resetPassword(email: string): Promise<any> {
  return firebase.auth().sendPasswordResetEmail(email);
}
  
  logoutUser(): Promise<any> {
  return firebase.auth().signOut();
  
  }
  

  signupUser(newEmail: string, newPassword: string): Promise<any> {
  return firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword).then(fulfilled=>{
    console.log("ACCOUNT CREATED");
    console.log(fulfilled);
    return fulfilled.user;

  });
  }




  
 
}