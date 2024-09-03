import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  constructor() {}
  addProduct() {
    window.location.href = '/management/products/product-detail';
  }
}
