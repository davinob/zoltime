import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateQuantityPage } from './update-quantity';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UpdateQuantityPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateQuantityPage),
    TranslateModule.forChild()
  ],
})
export class UpdateQuantityPageModule {}
