import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginTestPage } from './login-test';

@NgModule({
  declarations: [
    LoginTestPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginTestPage),
  ],
})
export class LoginTestPageModule {}
