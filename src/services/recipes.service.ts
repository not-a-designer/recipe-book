import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';

import { AuthService } from '../services/auth.service'
import { Recipe } from '../models/recipe.model';
import { Ingredient } from '../models/ingredient.model';

import 'rxjs/Rx';

@Injectable()
export class RecipesService {
    private recipeList: Recipe[] = [];

    constructor(private authService: AuthService, private http: Http) {}

    addRecipe(title: string, 
              description: string, 
              difficulty: string, 
              ingredients: Ingredient[]) {
        this.recipeList.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipeList);
    }

    getRecipes() {
        return this.recipeList.slice();
    }

    updateRecipe(index: number,
                 title: string,
                 description: string,
                 difficulty: string,
                 ingredients: Ingredient[]) {
        this.recipeList[index] = new Recipe(title, description, difficulty, ingredients);
        console.log(this.recipeList);
    }

    removeRecipe(index: number) {
        this.recipeList.splice(index, 1);
    }

    saveRecipes(token: string) {
        const userId = this.authService.getCurrentUser().uid;
        //console.log('userId = ' + userId);
        
        return this.http
            .put('https://ionic-recipes-97ae3.firebaseio.com/' + userId + '/recipeList.json?auth=' + token, this.recipeList)
            .map((response: Response) => {
                return response.json();
            });
    }

    fetchRecipes(token: string) {
        const userId = this.authService.getCurrentUser().uid;

        return this.http
            .get('https://ionic-recipes-97ae3.firebaseio.com/' + userId + '/recipeList.json?auth=' + token)
            .map((response: Response) => {
                return response.json();    
            })
            .do((recipes: Recipe[]) => {
                if(recipes) {
                    this.recipeList = recipes;
                } else {
                    this.recipeList = [];
                }
            });
    }
}