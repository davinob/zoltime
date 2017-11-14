import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateProductPage } from './update-product';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UpdateProductPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateProductPage),
    TranslateModule.forChild()
  ],
})
export class UpdateProductPageModule {}
