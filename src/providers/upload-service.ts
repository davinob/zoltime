import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase';
 import {UploadTaskSnapshot} from 'firebase/storage';
  
 import { Camera } from '@ionic-native/camera';
 import { GlobalService } from './global-service';

 
export interface Picture{
  url:string,
  folder?:string,
  name?:string
}

export class Upload {
  file:File=null;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();
  folder:string;
  base64String:string=null;
  isFile:boolean;

  constructor(fileOrBase64String:any,folder:string,isFile:boolean) {
    this.isFile=isFile;
    console.log("CONSTRUCTING UPLOAD");
    if (isFile)
    {
    this.file = fileOrBase64String;
    this.name=new Date().valueOf()+this.file.name;
    }
     else
      {
    this.base64String=fileOrBase64String;
    this.name=new Date().valueOf()+Math.random()+".jpg";
     }
    
    this.folder=folder;
    console.log(this);
  }


 
}

@Injectable()
export class UploadService {
  

  private basePath:string = '/uploads';

  constructor(public globalService:GlobalService,
      public camera: Camera) { 
  }

  initBasePath()
  {
    this.basePath='/uploads/'+this.globalService.userID;
  }
  
  
  takePicture(srcType:number):Promise<any>
  {
    return this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:srcType,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation:false,
      targetWidth: 200,
      targetHeight: 200,
      quality:100

    });
  }

  pushUpload(upload: Upload) :Promise<any>{
   
    console.log("UPLOAD TO PUSH");
    console.log(upload);
    let storageRef = firebase.storage().ref();
    let metadata = {
      customMetadata: {status:'first_upload'}
      };

      console.log("UPLOAD NAME");
      console.log(`${upload.name}`);
      console.log(upload.name);

    let uploadTask;
    
    if (upload.isFile)
    uploadTask= storageRef.child(`${this.basePath}/${upload.folder}/${upload.name}`).put(upload.file,metadata);
    else
    uploadTask= storageRef.child(`${this.basePath}/${upload.folder}/${upload.name}`).putString(upload.base64String,"base64",metadata);
    
    return new Promise<any>((resolve, reject) => {
      
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:UploadTaskSnapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(upload.progress);
      },
      (error) => {
        // upload failed
        console.log(error);
        reject(new Error("Error uploading the file"));
      },
      () => {
        let pic:Picture=
        {
          url:uploadTask.snapshot.downloadURL,
          folder:upload.folder,
          name:upload.name
        };

        upload.url = uploadTask.snapshot.downloadURL;
        resolve(pic);
      }
    );
    setTimeout( () => {
      reject(new Error("Error uploading the file"));
      }, 10000); 
    });
  }
  

  deletePicture(pic: Picture) {
  
    try{
    if ((pic.name!=null)&&(pic.folder!=null))
    {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${pic.folder}/${pic.name}`).delete()
    }
  }
  catch(error)
  {
    console.log("ISSUE DELETING PIC");
  }
  }

}