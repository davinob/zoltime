import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './tutorial';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    TutorialPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialPage),
    TranslateModule.forChild(),
    DirectivesModule
    
  ],
  exports: [
    TutorialPage
  ]
})
export class TutorialPageModule { }
