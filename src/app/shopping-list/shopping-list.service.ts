import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {

    ingredientsChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];

    getIngredients() {
        /**
         * Menggunakan slice agar kita tidak dapat mengakses array asli
         * yang tersimpan dalam  service ini
         */
        return this.ingredients.slice();
    }

    addIngredient(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients.slice());
    } 

    addIngredients(ingredients:Ingredient[]){
        // Cara ini akan membuat app menjadi lebih lambatt
        // for(let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // }

        // Gunakan cara ini lebih baik
        console.log('spread operator');
        // console.log(...ingredients);
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }
}