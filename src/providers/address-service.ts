import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase/app';


import { map,first } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
  
  



  
      
 async filterItems(searchTerm:string)
  {
	  let  csvUrl = 'assets/streets/streets.csv';

   searchTerm=searchTerm.trim();

     let dataT=await this.http.get(csvUrl).toPromise();

     console.log("AUTOCOMPLETE");

            let wholeText=dataT.text();
            let arr=wholeText.split("\n");
            let numReturned=0;

            let searchTermStreet=searchTerm.split(",")[0];
            if (searchTermStreet)
            searchTermStreet=searchTermStreet.trim();

            let searchTermCity=searchTerm.split(",")[1];
            if (searchTermCity)
            searchTermCity=searchTermCity.trim();
            

            let searchTermStreetWithoutNumber=searchTermStreet.replace(/[0-9]/g, '');
            console.log("Without number:");
            searchTermStreetWithoutNumber=searchTermStreetWithoutNumber.trim();
             console.log(searchTermStreetWithoutNumber);

             let newAddresses=new Array<any>();

            arr.filter(val=>{
               if (val.indexOf(searchTermStreetWithoutNumber)==-1 || numReturned>5)
                {
                return false;
                }
            
                if (searchTermCity)
                {
                  if ((! val.split(",")[1]) || (val.split(",")[1].indexOf(searchTermCity)==-1))
                  {
                    return false;
                  } 
                }

                numReturned++;
                return true;
            }
              ).map(val=>
                {
                  if (searchTermStreetWithoutNumber!=searchTermStreet)
                  {
                    console.log(val);
                    let values=val.split(",");
                    console.log(values);
                    console.log(values[1]);
                    if (values[1])
                    {
                      val=searchTermStreet+","+values[1];
                    }
                  }
                  return val.trim();

                }).filter((elem, index, self)=> { //removing duplicates
                  return index === self.indexOf(elem);
                }).forEach(val=>
                  {
                  
                  let address={description:val,isAddress:true};
                  newAddresses.push(address);
                  console.log(address);
                  }
                  );

                  console.log("SEARCHED ADDRESSES SERVICE");
                  console.log(newAddresses);
                return newAddresses;

  }
  
  
  getPosition(place):Observable<any>
  {
    console.log(place);
    let searchUrl:string="https://nominatim.openstreetmap.org/search?q="+place.description+"&format=json&polygon=1&addressdetails=1&countrycodes=IL";


    //let searchUrl:string="https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeID+"&key="+fbConfig.apiKey;
    let addressPos:Subject<any>=new Subject<any>();
    console.log(searchUrl);
     this.http.get(searchUrl).pipe(map(res => res.json())).subscribe(data => {
      let address:Address=<Address>{};

      console.log(data);
      let resAddress=data[0];
      
      if (!resAddress)
      {
        
        throw new Error(" כתובת לא נמצאת, נא לבדוק חיבור לשרת או לשנות כתובת");
        
      }
      address.geoPoint=new firebase.firestore.GeoPoint(Number(resAddress.lat),Number(resAddress.lon));

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
