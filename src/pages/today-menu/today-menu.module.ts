import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodayMenuPage } from './today-menu';

@NgModule({
  declarations: [
    TodayMenuPage
  ],
  imports: [
    IonicPageModule.forChild(TodayMenuPage),
  ],
  exports:
  [
   TodayMenuPageModule ]
})
export class TodayMenuPageModule {}
