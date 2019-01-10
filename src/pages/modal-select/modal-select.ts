import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-select',
  templateUrl: 'modal-select.html',
})
export class ModalSelectPage {

  dataList;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl : ViewController) {
    console.log(navParams);
    this.dataList=this.navParams.get('dataList');
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalSelectPage');
  }



  chooseValue(data)
  {
    this.viewCtrl.dismiss({chosen:data});
  }
}
