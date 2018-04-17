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
        subCategories: ["HAMBURGER", "FRIES", "HOT-DOG", "SALAD","DRINKS","DESSERTS","COMBINATION"]
      },
      {
        name: "Italian",
        icon: "italian.png",
        subCategories: ["PIZZA", "LASAGNA", "PASTA", "SALAD","DRINKS","DESSERTS","COMBINATION"]
      },
       {
        name: "Israeli",
        icon: "israeli.png",
        subCategories: ["SHAWARMA", "FALAFEL", "FRIES", "SHNITZEL", "HUMUS", "SALAD","DRINKS","DESSERTS","COMBINATION"]
      },
       {
        name: "Boulangerie",
        icon: "boulangerie.png",
        subCategories: ["BREAD", "CAKE", "BOREKAS", "SALAD", "SANDWICH","DRINKS","DESSERTS","COMBINATION"]
      },
      {
        name: "Sandwish",
        icon: "sandwish.png",
        subCategories: ["SANDWISH","DRINKS","DESSERTS","COMBINATION"]
      }
    ];



  constructor() { 
   }
  
  




  
 
}