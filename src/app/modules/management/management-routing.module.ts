import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './modules/options/pages/options/options.component';
import { ManagementComponent } from './management.component';
import { ProductsComponent } from './modules/products/pages/products/products.component';
import { ProductDetailComponent } from './modules/products/pages/product-detail/product-detail.component';
import { CategoriesComponent } from './modules/categories/pages/categories/categories.component';
import { OptionsValueComponent } from './modules/options/pages/options-value/options-value.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: '', redirectTo: 'management', pathMatch: 'full' },
      {
        path: 'options',
        component: OptionsComponent,
        loadChildren: () => import('./modules/options/options.module').then((m) => m.OptionsModule),
      },
      {
        path: 'test',
        component: OptionsValueComponent,
        loadChildren: () => import('./modules/options/options.module').then((m) => m.OptionsModule),
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        loadChildren: () => import('./modules/categories/categories.module').then((m) => m.CategoriesModule),
      },
      {
        path: 'products',
        component: ProductsComponent,
        loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'products/product-detail',
        component: ProductDetailComponent,
        loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
      },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule { }
