import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSelectPage } from './modal-select';

@NgModule({
  declarations: [
    ModalSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSelectPage),
  ],
})
export class ModalSelectPageModule {}
