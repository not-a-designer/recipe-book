import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { NgForm } from '@angular/forms';

import { MenuHelperService } from '../../services/menu-helper.service';
import { AuthService } from '../../services/auth.service';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menuHelper: MenuHelperService) {
      this.menuHelper.tabChanged.emit('SignupPage');
  }

  onSignup(form: NgForm) {
    let loading = this.loadingCtrl.create({
      content: 'Signing up...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password)
    .then((data) => {
      loading.dismiss();
      //console.log(data)
    })
    .catch((error) => {
      loading.dismiss();
      this.alertCtrl.create({
        title: 'Signup failed',
        message: error.message,
        buttons: ['OK']
      }).present();
      //console.log(error)
    });
    //console.log(form);
  }

  confirmPassword(pass: string, confirm: string) {
    return (pass !== confirm) ? false : true;
  }
}
