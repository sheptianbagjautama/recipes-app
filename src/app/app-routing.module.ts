import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },

  // Lazy Loading
  // Jika tidak ingin menggunakan lazy loading komen kode di bawah ini
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(r => r.RecipesModule )},
  { path: 'shopping-list', loadChildren:() => import('./shopping-list/shopping-list.module').then(s => s.ShoppingListModule )},
  { path: 'auth', loadChildren:() => import('./auth/auth.module').then(a => a.AuthModule )},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{ preloadingStrategy:PreloadAllModules}
  )],

  // Tanpa menggunakan lazy loading
  // imports: [RouterModule.forRoot(appRoutes)],
  // Agar dapat digunakan di file lain, lebih tepatnya di App Module
  exports: [RouterModule],
})
export class AppRoutingModule {}
