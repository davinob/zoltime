import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './tutorial';
 
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    TutorialPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialPage),
     ,
    DirectivesModule
    
  ],
  exports: [
    TutorialPage
  ]
})
export class TutorialPageModule { }
