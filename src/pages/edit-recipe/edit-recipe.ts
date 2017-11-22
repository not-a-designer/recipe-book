import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';

import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

import { Recipe } from '../../models/recipe.model';
import { Ingredient } from '../../models/ingredient.model';
import { RecipesService } from '../../services/recipes.service';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {

  mode: string = 'New';
  recipe: Recipe;
  index: number;
  difficultyOptions: string[] = [
    'Easy',
    'Medium',
    'Hard'
  ];
  recipeForm: FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public actionSheet: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public recipesService: RecipesService) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit'){
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if (this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for (let ing of this.recipe.ingredients) {
        ingredients.push(new FormGroup({
          'name': new FormControl(ing.name, Validators.required),
          'amount': new FormControl(ing.amount, Validators.required)
        }));
      }
      console.log('ingredients = ' + ingredients);
    }
    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  onSubmit() {
    const value = this.recipeForm.value;
    console.log(value.ingredients);
    let ingredients: Ingredient[] = [];
    if (value.ingredients.length > 0) {
      
      ingredients = value.ingredients
        .map((ingredient: Ingredient) => {
          return {name: ingredient.name, amount: ingredient.amount}
        });
    }
    if (this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    } else {
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
    //console.log(this.recipeForm);
  }

  onManageIngredients() {
    this.actionSheet.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert();
          }
        }, {
          text: 'Remove all ingredients',
          role: 'destructive',
          handler: () => {
            this.removeAllIngredients();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    }).present();
  }


  private createNewIngredientAlert() {
    this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        }, {
          name: 'amount', 
          placeholder: 'Amount',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }, {
          text: 'Add',
          handler: (data)=> {
            if (data.name.trim() == '' || data.name.trim() == null) {
              let msg = 'Enter a valid name!';
              this.onInputChange(msg);
              return;
            }
            if (data.amount.trim() == '' || data.amount.trim() == null) {
              let msg = 'Enter a valid amount!';
              this.onInputChange(msg);
              return;
            }
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
              'name': new FormControl(data.name, Validators.required),
              'amount': new FormControl(data.amount, Validators.required)
            }));
            let len = this.recipeForm.get('ingredients').value.length -1;
            console.log(this.recipeForm.get('ingredients').value[len]);
            let msg = '' + data.name + ' (' + data.amount + ') was successfully added';
            this.onInputChange(msg);
          }
        }
      ]
    }).present();
  }


  private removeAllIngredients() {
    const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
    const len = fArray.length;
    if (len > 0) {

      this.removeAllIngredientsAlert(fArray);
      
    } else {

      let msg = 'Ingredient list is already empty';
      this.onInputChange(msg);
    }
  }

  onRemoveIngredient(index: number) {
    let fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
    this.removeIngredientAlert(fArray, index);
    
    
  }

  private removeAllIngredientsAlert(formArray: FormArray) {
    this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to delete all ingredients?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }, {
          text: 'Delete All',
          role: 'destructive',
          handler: () => {
            for (let i = formArray.length - 1; i >=0; i--) {
              formArray.removeAt(i);
              let msg = 'All ingredients were removed';
              this.onInputChange(msg);
            }
          }
        }
      ]
    }).present();
  }

  private removeIngredientAlert(formArray: FormArray, index: number) {
    let selected: string = formArray.value[index];
    this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }, {
          text: 'Delete',
          role: 'desctructive',
          handler: () => {
            formArray.removeAt(index);
            let msg = '' + selected + ' was removed';
            this.onInputChange(msg);
          }
        }
      ]
    }).present();
  }
  private onInputChange(errMessage: string) {
    this.toastCtrl.create({
      message: errMessage,
      position: 'bottom',
      duration: 2000
    }).present();
  }

}
