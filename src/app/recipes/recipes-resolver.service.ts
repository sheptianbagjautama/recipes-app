import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

/**
 * ketika ada route yang menggunakan resolver ini, maka dipastikan akan melakukan fetch/mendapatkan semua data recipes dari API
 * terlebih dahulu sebelum route dijalankan
 * fungsinya agar misalkan kita berada di halaman detail atau edit recipe , pada saat refresh halaman tidak akan bug, karena data recipes 
 * nya belum di load, tapi dengan menggunakan resolve ini kita akan load recipes nya terlebih dahulu
 */
@Injectable({
    providedIn:'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService:DataStorageService,
                private recipesService:RecipeService){}

    resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
        // Mendapatkan data recipes dari service
        const recipes = this.recipesService.getRecipes();

        if(recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
    }
}