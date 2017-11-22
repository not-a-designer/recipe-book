import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../services/auth.service';
import { MenuHelperService } from '../services/menu-helper.service';

import firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';


const firebaseConfig = {
  apiKey: 'AIzaSyCpk8Lz0nECcuBGHHVLum_wQz1havBJkp8',
  authDomain: 'ionic-recipes-97ae3.firebaseapp.com',
  databaseURL: 'https://ionic-recipes-97ae3.firebaseio.com'
};

export interface Page {
  page: string;
  title: string;
  icon: string;
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  rootPage: string = 'TabsPage';
  tabsPage: string = 'TabsPage';
  signinPage: string = 'SigninPage';
  signupPage: string = 'SignupPage';
  @ViewChild('nav') nav: NavController;
  isAuthenticated: boolean = false;
  selectedRoot: string ='SigninPage';
  subscription: Subscription;

  public pages: Page[] = [
    {
      page: 'RecipesPage',
      title: 'Recipe List',
      icon: 'list-box'
    }, {
      page: 'ShoppingListPage',
      title: 'Shopping List',
      icon: 'cart'
    }
  ];

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public authService: AuthService,
    public menuHelper: MenuHelperService,
    public menuCtrl: MenuController) {

    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = this.tabsPage;
      } else {
        this.isAuthenticated = false;
        this.rootPage = this.signinPage;
      }
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }

  ngOnInit() {
    console.log(this.selectedRoot);
    this.subscription = this.menuHelper.tabChanged.subscribe((selected: string) => {
      this.selectedRoot = selected;
    });
  }

  onLoad(page: string, index: number) {
    this.rootPage = page;

    if (index != null) {
      this.nav.getActiveChildNavs()[0].select(index);
      console.log('page: ' +  page + '   index: ' + index);
      this.selectedRoot = this.pages[index].page; 
      
      /*setTimeout(() => {
        this.nav.getActiveChildNavs()[0].select(index);
      }, 100);*/
    } else {
      this.nav.setRoot(this.rootPage);
      console.log(this.rootPage);
    }
    this.menuHelper.tabChanged.emit(this.rootPage);
    this.menuCtrl.close();
    /*console.log(this.selectedRoot);
    let output = this.nav.getActiveChildNavs()[0].getSelected().root;
    console.log(output);*/
  }



  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
  }

  isSelected(page: string) {
    return (page === this.selectedRoot) ? true : false;
    
  }
}

