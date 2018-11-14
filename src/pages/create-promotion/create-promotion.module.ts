import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePromotionPage } from './create-promotion';
 

@NgModule({
  declarations: [
    CreatePromotionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePromotionPage),
     
  ],
})
export class CreatePromotionPageModule {}
