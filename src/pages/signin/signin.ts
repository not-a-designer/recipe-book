import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { NgForm } from '@angular/forms';

import { MenuHelperService } from '../../services/menu-helper.service';
import { AuthService } from '../../services/auth.service';


@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthService, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menuHelper: MenuHelperService) {
      this.menuHelper.tabChanged.emit('SigninPage');
  }

  onSignin(form: NgForm) {
    let loading = this.loadingCtrl.create({
      content: 'Signing in...'
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then((data) => {
        loading.dismiss();
      })
      .catch((error) => {
        loading.dismiss();
        this.alertCtrl.create({
          title: 'Signin failed',
          message: error.message,
          buttons: ['OK']
        }).present();
      })
    //console.log(form.value);
  }

}
