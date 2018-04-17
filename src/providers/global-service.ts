import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';





@Injectable()
export class GlobalService {
  
    userID:string;

  public categories=
    [
       {
        name: "American",
        icon: "american.png",
        subCategories: ["hamburger", "fries", "hot-dog", "salad","drinks","desserts"]
      },
      {
        name: "Italian",
        icon: "italian.png",
        subCategories: ["pizza", "lasagna", "pasta", "salad","drinks","desserts"]
      },
       {
        name: "Israeli",
        icon: "israeli.png",
        subCategories: ["shawarma", "falafel", "fries", "shnitzel", "humus", "salad","drinks","desserts"]
      },
       {
        name: "Boulangerie",
        icon: "boulangerie.png",
        subCategories: ["bread", "cake", "borekas", "salad", "sandwich","drinks","desserts"]
      },
      {
        name: "Sandwish",
        icon: "sandwish.png",
        subCategories: ["sandwish","drinks","desserts"]
      }
    ];

  constructor() { 
   }
  
  




  
 
}