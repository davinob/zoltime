import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePromotionPage } from './update-promotion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UpdatePromotionPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdatePromotionPage),
    TranslateModule.forChild()
  ],
})
export class UpdatePromotionPageModule {}
