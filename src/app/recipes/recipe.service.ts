import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';


@Injectable()
export class RecipeService {
    // Membuat Custom Event dengan subject, menerima data recipe sebagai array
    recipesChanged = new Subject<Recipe[]>();

    // Kita menggunakan EventEmitter untuk mengirim data di service 
    // Akan menjadi lebih mudah ketika mengirim data lintas component
    // recipeSelected = new EventEmitter<Recipe>();
    // recipeSelected = new Subject<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'Tasty Schnitzel', 
            'A super-tasty Schnitzel - Just awesome!',
            'https://www.telegraph.co.uk/content/dam/food-and-drink/2019/01/11/TELEMMGLPICT000185036503_trans_NvBQzQNjv4Bq8m3xuhMyFOjUOkuEnTdW-M-bhHwB87o-r13mliye62g.jpeg?imwidth=1400',
            [
                new Ingredient('Meat', 1),
                new Ingredient('Frech Fries', 20),
            ]),
        new Recipe(
            'Big Fat Burger', 
            'What else you need to say?', 
            'https://www.fatburgercanada.com/wp-content/uploads/2018/09/fb18_FatCheeseBeer-1024x425.png',
            [
                new Ingredient('Buns', 1),
                new Ingredient('Meat', 20),
            ]
        ),
      ];

    constructor(private slService:ShoppingListService){}

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index:number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients:any){
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe:Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index:number, newRecipe:Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index:number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}