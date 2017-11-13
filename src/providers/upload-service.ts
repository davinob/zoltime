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
  
 import { UserService,Picture } from './user-service';

export class Upload {
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();
  folder:string;

  constructor(file:File,folder:string) {
    console.log("CONSTRUCTING UPLOAD");
    this.file = file;
    this.name=new Date().valueOf()+this.file.name;
    this.folder=folder;
    console.log(this);
  }
}

@Injectable()
export class UploadService {
  

  private basePath:string = '/uploads';

  constructor(public afs: AngularFirestore,public userService:UserService) { 
this.basePath='/uploads/'+userService.userID;
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
    let uploadTask = storageRef.child(`${this.basePath}/${upload.folder}/${upload.name}`).put(upload.file,metadata);
    
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
      }, 150001); 
    });
  }
  

  deletePicture(pic: Picture) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${pic.folder}/${pic.name}`).delete()
  }

}