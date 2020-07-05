import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
    /**
     * Kita bisa menggunakan event emitter atau subject untuk membuat custom event
     */
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

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

    getIngredient(index:number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        // Jika menggunakan event emitter emit
        // Jika menggunakan subject yaitu next
        this.ingredientsChanged.next(this.ingredients.slice());
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
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index:number, newIngredient:Ingredient) {
        this.ingredients[index] = newIngredient;
        console.log(newIngredient);
        this.ingredientsChanged.next(this.ingredients.slice());
        console.log(this.ingredients.slice());
    }

    deleteIngredient(index:number){
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}