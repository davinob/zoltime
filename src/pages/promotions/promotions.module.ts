import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromotionsPage } from './promotions';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PromotionsPage
  ],
  imports: [
    IonicPageModule.forChild(PromotionsPage),
    TranslateModule.forChild()
  ]
})
export class PromotionsPageModule {}
