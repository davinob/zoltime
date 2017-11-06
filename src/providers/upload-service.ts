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
  

export class Upload {
  key: string;
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();
  constructor(file:File) {
    this.file = file;
    this.key= (new Date().valueOf()).toString()+Math.random();
  }
}

@Injectable()
export class UploadService {
  uploadsCollectionRef: AngularFirestoreCollection<Upload>;

  constructor(public afs: AngularFirestore) { 

    this.uploadsCollectionRef = this.afs.collection<any>('uploads');  
  }

  private basePath:string = '/uploads';
  

  pushUpload(upload: Upload) {
    let storageRef = firebase.storage().ref();
    let metadata = {
      customMetadata: {status:'first_upload'}
      };

    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file,metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:UploadTaskSnapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(upload.progress);
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;
        this.saveFileData(upload)
      }
    );
  }
  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    let myUpload:any={name:upload.name,
                      url:upload.url,
                      createDate:upload.createdAt};

    this.uploadsCollectionRef.doc(upload.key).set(myUpload);
  }

  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.key)
    .then( () => {
      this.deleteFileStorage(upload.name)
    })
    .catch(error => console.log(error))
  }
  // Deletes the file details from the realtime db
  private deleteFileData(key: string) {
    return this.uploadsCollectionRef.doc(key).delete();
  }
  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name:string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

}