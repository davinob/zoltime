import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePromotionSuitePage } from './update-promotion-suite';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UpdatePromotionSuitePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdatePromotionSuitePage),
    TranslateModule.forChild()
  ],
})
export class UpdatePromotionSuitePageModule {}
