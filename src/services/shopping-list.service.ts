import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Ingredient } from '../models/ingredient.model';
import 'rxjs/Rx';


@Injectable()
export class ShoppingListService {
    private ingredients: Ingredient[] = [];

    constructor(private http: Http, private authService: AuthService) {}

    addItem(name: string, amount: number) {
        this.ingredients.push(new Ingredient(name, amount));
        console.log(this.ingredients);
    }

    addItems(items: Ingredient[]) {
        this.ingredients.push(...items);
        console.log(this.ingredients);
    }

    getItem(index: number) {
        return this.ingredients[index];
    }

    getItems() {
        return this.ingredients.slice();
    }

    removeItem(index: number) {
        if (this.ingredients.length > -1) {
            this.ingredients.splice(index, 1);
        }
        console.log(this.ingredients);
    }

    updateItem(index: number, newItem: Ingredient) {
        this.ingredients[index] = newItem;
    }

    saveList(token: string) {
        const userId = this.authService.getCurrentUser().uid;
        console.log('userId = ' + userId);

        return this.http
            .put('https://ionic-recipes-97ae3.firebaseio.com/' + userId + '/shopping-list.json?auth=' + token, this.ingredients)
            .map((response: Response) => {
                return response.json();
            });
    }

    fetchList(token: string) {
        const userId = this.authService.getCurrentUser().uid;

        return this.http
        .get('https://ionic-recipes-97ae3.firebaseio.com/' + userId + '/shopping-list.json?auth=' + token)
        .map((response: Response) => {
            return response.json();
        })
        .do((ingredients: Ingredient[]) => {
            if(ingredients) {
                this.ingredients = ingredients;
            } else {
                this.ingredients = [];
            }
        });
    }
}