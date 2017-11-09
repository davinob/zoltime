import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProductPage } from './create-product';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateProductPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateProductPage),
    TranslateModule.forChild()
  ],
})
export class CreateProductPageModule {}
