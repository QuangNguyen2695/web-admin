import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MangementModule } from '../../management.module';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDropMixedSortingExample } from '../../components/image-drag-drop/cdk-drag-drop-mixed-sorting-example';
import { AddVaritantProductFormComponent } from './component/add-varitant-product-form/add-varitant-product-form.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailComponent,
    AddVaritantProductFormComponent,
    CdkDragDropMixedSortingExample,
  ],
  imports: [CommonModule, MangementModule, AngularEditorModule, DragDropModule, CdkDropList, CdkDrag],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsModule {}
