import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { map, take, tap, exhaustMap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

/**
 * Injectable disini berfungsi untuk memasukan server lain ke dalam service ini
 * providedIn:'root' --> maksudnya yaitu untuk mendaftarkan service ini ke dalam app module, 
 * bisa saja kita daftar langsung di app module, cuman ini adalah cara yang lebih mudahnya
 */
@Injectable({
    providedIn:'root'
})

export class DataStorageService {
    constructor(private http:HttpClient,
                private recipeService:RecipeService,
                private authService:AuthService) {}

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        this.http
            .put(
                'https://ng-course-recipe-book-ea184.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe(response => {
                console.log(response)
            });
    } 

    fetchRecipes(){
        return this.http.get<Recipe[]>(
            'https://ng-course-recipe-book-ea184.firebaseio.com/recipes.json'
        )
        .pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients:recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        )
    }

    // Menambahkan token ke request tanpa menggunakan interceptor
    // fetchRecipes(){
    //     /**
    //      * take(1) --> mengambil data terakhir user
    //      * exhaustMap --> fungsinya untuk menunggu observable pertama yaitu this.authService.user. setelah 
    //      * observable pertama tersebut selesai, akan lanjut ke observable kedua
    //      */
    //     return this.authService.user.pipe(
    //         take(1), 
    //         /**
    //          * Observable pertama akan mendapatkan data user dari behaviour object, 
    //          * disini kita parse lagi untuk di gunakan di observable kedua yaitu HTTP Request
    //          */
    //         exhaustMap(user => {
    //             /**
    //              * Disini kita akan return observable kedua, yang akan menggantikan observable pertama 
    //              * intinya seluruh observable chain sekarang akan di gantikan oleh Observable HTTP request ini
    //              */
    //             return this.http.get<Recipe[]>(
    //                 'https://ng-course-recipe-book-ea184.firebaseio.com/recipes.json',
    //                 {
    //                     params:new HttpParams().set('auth', user.token)
    //                 }
    //             );
    //         }),
    //         /**
    //          * untuk transforming dan set data dari 2 operators map dan tap
    //          * kita bisa tempatkan next steps after the exhaustMap
    //          */
    //         map(recipes => {
    //             return recipes.map(recipe => {
    //                 return { ...recipe, ingredients:recipe.ingredients ? recipe.ingredients : [] };
    //             });
    //         }),
    //         tap(recipes => {
    //             this.recipeService.setRecipes(recipes);
    //         })
    //     );
    // }
}