import { Component } from '@angular/core';
import { Product, SearchProducts } from 'src/app/modules/management/model/product.model';
import { ProductsService } from '../../../service/products.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {

  searchProducts: SearchProducts = new SearchProducts();
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingProducts: boolean = false;

  constructor(private productsService: ProductsService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  addProduct() {
    this.router.navigate(['/management/products/product-detail']);
  }

  loadData(): void {
    this.isLoadingProducts = true;
    this.productsService.searchProducts(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchProducts) => {
        if (res) {
          this.searchProducts = res;
          this.totalItem = this.searchProducts.totalItem;
          this.totalPage = this.searchProducts.totalPage;
        }
        this.isLoadingProducts = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoadingProducts = false;
      },
    });
  }

  toggleProducts(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchProducts.products = this.searchProducts.products.map((product: Product) => ({
      ...product,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchProducts.products.some((product: Product) => !product.selected);
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Product',
        content:
          'Are you sure you want to delete this product? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel'
          },
          {
            label: 'YES',
            type: 'submit'
          },
        ]
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productsService.deleteProduct(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchProducts.products = this.searchProducts.products.filter((product) => product.id !== id);
              toast.success('Product deleted successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  editProduct(product: Product): void {
    this.router.navigate(['/management/products/product-detail', { id: product.id }], { state: { product } });
  }

  reloadProductsPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchProductsPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortProductsPage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }

  private handleRequestError(error: any): void {
    const msg = 'An error occurred while processing your request';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => { },
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }
}
