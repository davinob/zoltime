import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase/app';
import * as fbConfig from './../providers/fbConfig'; 

export interface Address{
    geoPoint:firebase.firestore.GeoPoint;
   streetNumber:number;
   street:string;
   city:string;
   description:string;
}

@Injectable()
export class AddressService{
  
 

  constructor( public http: Http) {
  }
  
  

      
  filterItems(searchTerm:string):Observable<any>
  {
    let searchUrl:string="https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+searchTerm+"&types=geocode&components=country:il&language=iw&key="+fbConfig.apiKey;
    let allAddresses:Subject<any>=new Subject<any>();

     this.http.get(searchUrl).map(res => res.json()).subscribe(data => {
      let newAdd=data.predictions.filter((address) => {
        return address.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
      console.log("NEW ADDRESS:");
      console.log(newAdd);
      
      allAddresses.next({value:newAdd});
     },
    err=>{
    console.log(err);
    }
    );
   return allAddresses.asObservable();

  }
  
  
  getPosition(place):Observable<any>
  {
    let placeID=place.place_id;

    let searchUrl:string="https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeID+"&language=iw&key="+fbConfig.apiKey;
    let addressPos:Subject<any>=new Subject<any>();

     this.http.get(searchUrl).map(res => res.json()).subscribe(data => {
      let address:Address=<Address>{};
      
      address.geoPoint=new firebase.firestore.GeoPoint(data.result.geometry.location.lat,data.result.geometry.location.lng);

      address.description=place.description;

      addressPos.next({value:address});
      
     
     },
    err=>{
    console.log(err);
    }
    );
 
    return addressPos.asObservable();
  }




}
