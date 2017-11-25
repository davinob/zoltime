import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodayMenuPage } from './today-menu';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    TodayMenuPage
  ],
  imports: [
    IonicPageModule.forChild(TodayMenuPage),
    TranslateModule.forChild(),
    IonicImageLoader
  ]
})
export class TodayMenuPageModule {}
