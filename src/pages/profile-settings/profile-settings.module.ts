import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSettingsPage } from './profile-settings';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ProfileSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSettingsPage),
    TranslateModule.forChild(),
    IonicImageLoader
  ],
})
export class ProfileSettingsPageModule {}
