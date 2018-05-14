import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase/app';

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
  
  
  key:string="AIzaSyDXH1P9t_7NbM4xKUptwQ47YjNYSosLi_k";
      
  filterItems(searchTerm:string):Observable<any>
  {
    let searchUrl:string="https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+searchTerm+"&types=geocode&components=country:il&language=iw&key="+this.key;
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
  
  
  getPosition(placeID:string):Observable<any>
  {
    let searchUrl:string="https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeID+"&key="+this.key;
    let addressPos:Subject<any>=new Subject<any>();

     this.http.get(searchUrl).map(res => res.json()).subscribe(data => {
      let address:Address=<Address>{};
      
     for (let addressComp of data.result.address_components) {
       if (addressComp.types[0]=="street_number")
         address.streetNumber=addressComp.long_name;
   
       if (addressComp.types[0]=="route")
         address.street=addressComp.long_name;
      
       if (addressComp.types[0]=="locality")
         address.city=addressComp.long_name;
      }
      
      address.geoPoint=new firebase.firestore.GeoPoint(data.result.geometry.location.lat,data.result.geometry.location.lng);

      this.setAddressDescription(address);

      addressPos.next({value:address});
      
     
     },
    err=>{
    console.log(err);
    }
    );
 
    return addressPos.asObservable();
  }


  setAddressDescription(address:Address):void
  {
   
    let addressDescription="";
    if (address.street)
    addressDescription+=address.street+" ";
    if (address.streetNumber)
    addressDescription+=address.streetNumber+", ";
    addressDescription+=address.city;

    address.description=addressDescription;
  }

}
