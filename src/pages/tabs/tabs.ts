import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuHelperService } from '../../services/menu-helper.service';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  public pages: any[] = [
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
  sIndex: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public menuHelper: MenuHelperService) {
  }

  tabsChanged(event: Event) {
    //console.log(event);
    let myString: string = this.navCtrl.getActiveChildNavs()[0].getSelected().root;
    console.log(myString);
    this.menuHelper.tabChanged.emit(myString);
  }

}
