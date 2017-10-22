import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { EmailValidator } from '../../validators/email';
import { TodayMenuPage } from '../today-menu/today-menu';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase';


interface Todo {
  todoName: string;
  todoContent: string;
 }

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  
  todos: Observable<Todo[]>;
  todosRef: AngularFirestoreCollection<Todo>;
  
  public loginForm:FormGroup;
  public loading:Loading;
  public db:any;


firebaseConfig = {
    apiKey: "AIzaSyCjWUCqcYx8lGtAKWI8Q-5H8V1rktUQjJc",
    authDomain: "zoltime-77973.firebaseapp.com",
    databaseURL: "https://zoltime-77973.firebaseio.com",
    projectId: "zoltime-77973",
    storageBucket: "zoltime-77973.appspot.com",
    messagingSenderId: "1026370061265"
  };
  
  constructor(public navCtrl: NavController, public authData: AuthService, 
    public formBuilder: FormBuilder, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,  private afs: AngularFirestore) {
    
    if (!firebase.apps.length) {
    firebase.initializeApp(this.firebaseConfig);
    }
    
    this.db=firebase.firestore();
    
   // this.todosRef = this.afs.collection('todos');
  //  this.todos = this.todosRef.valueChanges(); 
    
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
      

  }
  
  test(){
    console.log("AAAAADDING");
    this.db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
console.log("AAAAADDING");
  }

  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.navCtrl.setRoot(TodayMenuPage);
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  goToResetPassword(){
    this.navCtrl.push('ResetPasswordPage');
  }

  createAccount(){
    this.navCtrl.push('SignUpPage');
  }


}