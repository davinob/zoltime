import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSettingsPage } from './profile-settings';
 
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    ProfileSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSettingsPage),
    DirectivesModule
  ],
})
export class ProfileSettingsPageModule {}
