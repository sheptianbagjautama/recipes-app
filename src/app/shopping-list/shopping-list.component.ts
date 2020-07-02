import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  /**
   * Kita menggunakan good practice yaitu dengan memasukan Observable ke dalam property/variable
   * dan ketika meninggalkan component ini kita harus menghentikan observable dengan menggunakan
   * lifecycle hook OnDestroy
   */
  private igChangeSub:Subscription;

  constructor(private slService:ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged
    .subscribe(
      (ingredients:Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy():void {
    this.igChangeSub.unsubscribe();
  }

}