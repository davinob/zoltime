import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';

export interface Address{
   lat:number;
   lng:number;
   streetNumber:number;
   street:string;
   city:string;
}

@Injectable()
export class AddressService{
  
  allAddresses:any;

  constructor( public http: Http) {
  }
  
  key:string="AIzaSyDXH1P9t_7NbM4xKUptwQ47YjNYSosLi_k";
      
  filterItems(searchTerm:string):Promise<any>
  {
    let searchUrl:string="/mapsAutocomplete/json?input="+searchTerm+"&types=geocode&components=country:il&language=iw&key="+this.key;
   
     return new Promise<any>((resolve, reject) => {
     this.http.get(searchUrl).map(res => res.json()).subscribe(data => {
      this.allAddresses=data.predictions.filter((address) => {
            return address.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
      
         setTimeout( () => {
            resolve(this.allAddresses);
        }, 1500);
     },
    err=>{
    console.log(err);
    }
    );
  });

  }
  
  
  getPosition(placeID:string):Promise<any>
  {
    let searchUrl:string="/mapsDetails/json?placeid="+placeID+"&key="+this.key;
   
     return new Promise<any>((resolve, reject) => {
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
      
      address.lat=data.result.geometry.location.lat;
      address.lng=data.result.geometry.location.lng;
      
      setTimeout( () => {
            resolve(address);
        }, 1500);
     },
    err=>{
    console.log(err);
    }
    );
  });

  }

}
