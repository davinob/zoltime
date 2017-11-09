import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodayMenuPage } from './today-menu';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TodayMenuPage
  ],
  imports: [
    IonicPageModule.forChild(TodayMenuPage),
    TranslateModule.forChild()
  ],
  exports:
  [
   TodayMenuPageModule ]
})
export class TodayMenuPageModule {}
