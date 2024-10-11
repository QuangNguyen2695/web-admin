import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Category, SearchCategories } from 'src/app/modules/management/model/categories.model';
import { CatagoriesService } from '../../../service/categories.servive';
import { CreateEditCategoriesDialogComponent } from '../../component/create-edit-category-dialog/create-edit-category-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  searchCategories: SearchCategories = new SearchCategories();
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingCategories: boolean = false;

  constructor(private catagoriesService: CatagoriesService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingCategories = true;
    this.catagoriesService.searchCaterogies(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchCategories) => {
        if (res) {
          this.searchCategories = res;
          this.totalItem = this.searchCategories.totalItem;
          this.totalPage = this.searchCategories.totalPage;
        }
        this.isLoadingCategories = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoadingCategories = false;
      },
    });
  }

  toggleCategories(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchCategories.categories = this.searchCategories.categories.map((category: Category) => ({
      ...category,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchCategories.categories.some((category) => !category.selected);
  }

  deleteCategory(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Category',
        content:
          'Are you sure you want to delete this category? All of your data will be permanently removed. This action cannot be undone.',
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
        this.catagoriesService.deleteCategory(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchCategories.categories = this.searchCategories.categories.filter((category) => category.id !== id);
              toast.success('Category deleted successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CreateEditCategoriesDialogComponent, {
      data: {
        title: 'Edit Category',
        category: { ...category },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.catagoriesService.updateCategory(result).subscribe({
          next: (res: Category) => {
            if (res) {
              this.searchCategories.categories = this.searchCategories.categories.map((category: Category) =>
                category.id === res.id ? { ...category, ...res } : category,
              );
              toast.success('Category updated successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CreateEditCategoriesDialogComponent, {
      data: {
        title: 'Add New Category',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.catagoriesService.createCategory(result).subscribe({
          next: (res: Category) => {
            if (res) {
              this.loadData();
              toast.success('Category added successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  reloadCategoriesPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchCategoriesPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortCategoriesPage(sortBy: string) {
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
