import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MangementModule } from '../../management.module';
import { CategoriesComponent } from './pages/categories/categories.component';
import { NzHighlightPipe } from 'ng-zorro-antd/core/highlight';
import { NavbarSubmenuComponent } from 'src/app/modules/layout/components/navbar/navbar-submenu/navbar-submenu.component';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [CommonModule, MangementModule, NzHighlightPipe],
})
export class CategoriesModule { }
