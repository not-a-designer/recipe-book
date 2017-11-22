import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { Recipe } from '../../models/recipe.model';
import { AuthService } from '../../services/auth.service';
import { RecipesService } from '../../services/recipes.service';


@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  recipeList: Recipe[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public authService: AuthService, 
    public recipesService: RecipesService) {
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onNewRecipe() {
    this.navCtrl.push('EditRecipePage', {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push('RecipePage', {recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Loading recipes...'
    });

    const popover = this.popoverCtrl.create('DbOptionsPage', {}, {enableBackdropDismiss: true});
    popover.present({ev: event});

    popover.onDidDismiss((data) => {
      
      if(data != null) {       

        if (data.action == 'load') {

          loading.present();

          //LOAD
          this.authService.getCurrentUser().getIdToken()
            .then(
              (token) => {
                this.recipesService.fetchRecipes(token)
                  .subscribe(
                    (list: Recipe[]) => {
                      loading.dismiss();

                      if (list) {
                        this.recipeList = list;
                        this.handleSuccess('Recipe list was loaded!');
                        console.log('Success');
                      } else if (!list &&this.recipeList.length > 0) {

                        //SAVE IF EMPTY
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
                                    this.recipesService.saveRecipes(token)
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
                        //END SAVE IF EMPTY

                      } else {
                          this.handleError('No recipes available');
                          console.log('Success, but list is empty');
                      }
                    }, 
                    (error) => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                      console.log('Error');
                    });
              }
            );
            //END LOAD FUNCTION
          
          } else if (data.action == 'save') {

            if (this.recipeList.length < 1) {

              this.handleError('Recipe list is empty!');

            } else {
              //SAVE FUNCTION
              this.authService.getCurrentUser().getIdToken()
                .then((token) => {
                  
                  this.recipesService.saveRecipes(token)
                    .subscribe(
                      () => {
                        loading.dismiss();
                        this.handleSuccess('Recipe list was saved!')
                        console.log('Success');
                      }, (error) => {
                        loading.dismiss();
                        this.handleError(error.json().error);
                        console.log('Error');
                      }
                    );
              
                });
                //END SAVE FUNCTION
            }
          } 
        }
      
    });
  }







  /*private methods*/
  private loadItems() {
    this.recipeList = this.recipesService.getRecipes();
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
  /*----------*/
}
