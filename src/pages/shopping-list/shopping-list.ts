import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { 
  IonicPage, 
  NavController, 
  NavParams, 
  ItemSliding, 
  AlertController, 
  PopoverController, 
  LoadingController, 
  ToastController } from 'ionic-angular';

import { ShoppingListService } from '../../services/shopping-list.service';
import { AuthService } from '../../services/auth.service';
import { Ingredient } from '../../models/ingredient.model';


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  listItems: Ingredient[];
  selectedItem: number;
  @ViewChild('f') f: NgForm;
  @ViewChild('slidingItem') slidingItem: ItemSliding;
  editMode: boolean = false;

  constructor(
    private slService: ShoppingListService,
    private authService: AuthService,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Loading list...'
    });

    const popover = this.popoverCtrl.create('DbOptionsPage');
    popover.present({ev: event});

    popover.onDidDismiss((data) => {
      
      if (data != null) {

        if (data.action == 'load') {

          loading.present();

          this.authService.getCurrentUser().getIdToken()
            .then(
              (token) => {
                this.slService.fetchList(token)
                  .subscribe(
                    (list: Ingredient[]) => {
                      loading.dismiss();

                      if (list) {
                        this.listItems = list;
                        this.handleSuccess('Shopping list was loaded!');
                        console.log('Success');
                      } else if (!list && this.listItems.length > 0){

                        this.alertCtrl.create({
                          title: 'Loading error',
                          message: 'There were no recipes in the cloud. Would you like to save your current recipe list?',
                          buttons: [
                            {
                              text: 'Cancel',
                              role: 'cancel',
                              handler: () => {
                                console.log('cancel clicked');
                              }
                            }, {
                              text: 'Save',
                              handler: () => {

                                this.authService.getCurrentUser().getIdToken()
                                  .then((token) => {
                                    this.slService.saveList(token)
                                      .subscribe(
                                        () => {
                                          this.handleSuccess('Recipe list was saved!')
                                          console.log('Success');
                                        }, (error) => {
                                          this.handleError(error.json().error);
                                          console.log('Error');
                                        }
                                      );
                                  });
                                }
                                //HANDLER
                              }]
                        }).present();
                        this.handleError('No recipes available');
                        console.log('Success, but list is empty');
                      }
                    }, (error) => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                      console.log('Error');
                    }
                  );
              }
            );

          } else if (data.action == 'save') {

            this.authService.getCurrentUser().getIdToken()
              .then((token: string) => {
                this.slService.saveList(token)
                  .subscribe(
                    () => {
                      loading.dismiss();
                      console.log('Success');
                    }, (error) => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                      //console.log(error);
                  });
              });
          }
        }
    });
  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.ingredientAmount);
    form.reset();
    this.loadItems();
  }

  onEditItem(form: NgForm) {
    this.slService.updateItem(this.selectedItem, new Ingredient(form.value.ingredientName, form.value.ingredientAmount));
    form.reset();
    this.loadItems();
    this.editMode = false;
  }

  doRemoveItem(index: number, item: ItemSliding) {
    this.closeSliding(item);
    this.alertCtrl.create({
      title: 'Delete Ingredient',
      message: 'Are you sure you want to remove this item?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('cancel clicked');
        }
      }, {
        text: 'Confirm',
        handler: () => {
          this.slService.removeItem(index);
          this.loadItems();
        }
      }]
    }).present();
    
  }

  doEditItem(index: number, item: ItemSliding) {
    this.closeSliding(item);
    this.editMode = true;
    this.selectedItem = index;
    const selectedIng = this.slService.getItem(index);
    this.f.setValue({
      ingredientName: selectedIng.name,
      ingredientAmount: selectedIng.amount
    });
  }

  private closeSliding(item: ItemSliding) {
    item.close();
  }

  private loadItems() {
    this.listItems = this.slService.getItems();
  }

  private handleError(errMessage: string) {
    this.alertCtrl.create({
      title: 'Error',
      message: errMessage,
      buttons: ['OK']
    }).present();
  }


  private handleSuccess(sMessage: string) {
    this.toastCtrl.create({
      message: sMessage,
      position: 'bottom',
      duration: 2000
    }).present();
  }

}
