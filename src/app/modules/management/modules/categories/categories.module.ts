import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MangementModule } from '../../management.module';
import { CategoriesComponent } from './pages/categories/categories.component';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [CommonModule, MangementModule],
})
export class CategoriesModule {}
