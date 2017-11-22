import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DbOptionsPage } from './db-options';

@NgModule({
  declarations: [
    DbOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(DbOptionsPage),
  ],
  exports: [
    DbOptionsPage
  ]
})
export class DbOptionsPageModule {}
