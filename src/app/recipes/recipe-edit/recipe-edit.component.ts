import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id:number;
  editMode = false;
  recipeForm:FormGroup;

  constructor(private route:ActivatedRoute,
              private recipeService:RecipeService, 
              private router:Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params:Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )
  }

  onSubmit(){
    // console.log(this.recipeForm);
    // Cara 1
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );

    /**
     * Karena model dari Recipe dan request dari form sama namanya maka kita bisa menggunakan cara lain yaitu Cara 2 dibawah :
     * itulah keuntungan jika kita menggunakan penerapan reactive form
     */
    //Cara 1
    // if (this.editMode) {
    //   this.recipeService.updateRecipe(this.id, newRecipe);
    // } else {
    //   this.recipeService.addRecipe(newRecipe);
    // }

    //Cara 2
     if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    // Akan melakukan navigasi ke halaman detail yaitu recipe/2 misalkan
    // Intinya mundur 1 level routeing 
    // relativeTo --> configurasi route saat ini
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onAddIngredient(){
    /**
     * <FormArray>this.recipeForm.get('ingredients')) --> memberitahu kepada angular bahwa ini adalah form array yang akan kita control
     */
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount' : new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      }) 
    );
  }

  // a getter !
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      console.log(recipe);
      if (recipe['ingredients']) {
        for(let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

}
