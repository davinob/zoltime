import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePromotionSuitePage } from './create-promotion-suite';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreatePromotionSuitePage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePromotionSuitePage),
    TranslateModule.forChild()
  ],
})
export class CreatePromotionSuitePageModule {}
