import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePromotionPage } from './create-promotion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreatePromotionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePromotionPage),
    TranslateModule.forChild()
  ],
})
export class CreatePromotionPageModule {}
