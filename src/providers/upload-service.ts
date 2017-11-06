import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {
  AngularFirestore,
  AngularFirestoreCollection} from 'angularfire2/firestore';
  import * as firebase from 'firebase';
 import {UploadTaskSnapshot} from 'firebase/storage';
  
 import { UserService } from './user-service';

export class Upload {
  key: string;
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();
  folder:string;

  constructor(file:File,folder:string) {
    this.file = file;
    this.key= (new Date().valueOf()).toString()+Math.random();
    this.folder=folder;
  }
}

@Injectable()
export class UploadService {
  

  private basePath:string = '/uploads';

  constructor(public afs: AngularFirestore,public userService:UserService) { 
this.basePath='/uploads/'+userService.userID;
  }

  
  

  pushUpload(upload: Upload) :Promise<any>{
    let storageRef = firebase.storage().ref();
    let metadata = {
      customMetadata: {status:'first_upload'}
      };

    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file,metadata);
    
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
        // upload success
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;
        resolve({url:upload.url,name:upload.name});
      }
    );
    setTimeout( () => {
      reject(new Error("Error uploading the file"));
      }, 150001); 
    });
  }
  

  deleteUpload(upload: Upload) {
   this.deleteFileStorage(upload.name)
    
  }
  
  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name:string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

}