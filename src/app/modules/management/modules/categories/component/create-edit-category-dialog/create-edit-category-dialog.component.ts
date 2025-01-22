import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { Category, Category2Create, CategoryFlatNode, CategoryTreeNode } from 'src/app/modules/management/model/categories.model';
import { CatagoriesService } from '../../../service/categories.servive';
import { Utils } from 'src/app/shared/utils/utils';

export interface DialogData {
  title: string;
  listCategories: any;
  category: Category;
}

@Component({
  selector: 'app-create-edit-category-dialog',
  templateUrl: './create-edit-category-dialog.component.html',
  styleUrl: './create-edit-category-dialog.component.scss',
})
export class CreateEditCategoriesDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditCategoriesDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  category: Category = this.data.category ?? new Category2Create();

  searchParentCategory: string = "";

  transformer = (node: CategoryTreeNode, level: number): CategoryFlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.id === node.id
        ? existingNode
        : {
          id: node.id,
          name: node.name,

          expandable: !!node.children && node.children.length > 0,
          level,
          disabled: !!node.disabled,
          isSelected: false
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  treeControl = new FlatTreeControl<CategoryFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener: any;
  dataSource: any;

  flatNodeMap = new Map<CategoryFlatNode, CategoryTreeNode>();
  nestedNodeMap = new Map<CategoryTreeNode, CategoryFlatNode>();
  selectListSelection = new SelectionModel<CategoryFlatNode>();

  createEditCategoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private catagoriesService: CatagoriesService,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  // Initialize the main form
  private async initForm() {
    this.createEditCategoryForm = this.fb.group({
      name: [this.category.name, [Validators.required, Validators.minLength(10)]],
      description: [this.category.description],
      parentId: [this.category.parentId]
    });
  }

  // Initialize 
  private async initData() {
    console.log("this.data", this.data);

    this.treeFlattener = new NzTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataSource.setData(this.data.listCategories);
    console.log("🚀 ~ CreateEditCategoriesDialogComponent ~ initData ~ this.data.listCategories:", this.data.listCategories)

    const categorytNode: any = this.getNode(this.category.id);

    //set parent category
    this.setSelectedParentCategoryOnTree();
    this.setDisablleCurrentCategoryOnTree();
    this.setExpandTreeNode(categorytNode);
  }

  async fillterToRemoveCurrentCateroty(listCategories: any) {
    return await listCategories.filter(async (c: any) => {
      if (c.children) {
        return await this.fillterToRemoveCurrentCateroty(c.children);
      }
      return c.id == this.category.id;
    })
  }

  setSelectedParentCategoryOnTree() {
    const parentCategorytNode: any = this.getNode(this.category.parentId);
    if (parentCategorytNode) {
      parentCategorytNode.isSelected = true;
    }
  }

  setDisablleCurrentCategoryOnTree() {
    const categorytNode: any = this.getNode(this.category.id);
    categorytNode.disabled = true;
  }

  setExpandTreeNode(node: any) {
    const parentNode = this.getParentNode(node);
    if (!parentNode) {
      return;
    }
    this.treeControl.expand(parentNode);
    this.setExpandTreeNode(parentNode)
  }

  onButtonClick() { }

  closeDialog(dialogResult: any): void {
    this.dialogRef.close(dialogResult);
  }

  hasChild = (_: number, node: CategoryFlatNode): boolean => node.expandable;

  getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  onSubmit() {
    if (!this.createEditCategoryForm.valid) {
      this.markFormGroupTouched(this.createEditCategoryForm);
      return;
    }

    let categoryUpsert = this.prepareProductData();
    if (this.category.id) {
      this.updateCategory(categoryUpsert);
    } else {
      this.createCategory(categoryUpsert);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private prepareProductData() {
    const formValue = this.createEditCategoryForm.getRawValue();

    return {
      id: this.category.id || "",
      name: formValue.name,
      description: formValue.description,
      parentId: formValue.parentId,
    };
  }

  createCategory(categoryUpsert: any) {
    console.log("🚀 ~ ProductDetailComponent ~ onSubmit ~ categoryUpsert:", categoryUpsert)
    this.catagoriesService.createCategory(categoryUpsert).subscribe({
      next: (res: Category) => {
        if (res) {
          this.closeDialog(true);
        }
      },
      error: (error) => this.utils.handleRequestError(error),
    });
  }

  updateCategory(categoryUpsert: any) {

    categoryUpsert = {
      ...categoryUpsert,
      id: this.category.id
    }
    this.catagoriesService.updateCategory(categoryUpsert).subscribe({
      next: (res: Category) => {
        if (res) {
          this.closeDialog(true);
        }
      },
      error: (error) => this.utils.handleRequestError(error),
    });
  }

  toggleNode(node: any) {
    this.treeControl.dataNodes.forEach((n: any) => {
      n.isSelected = node != n ? false : !node.isSelected;
    })

    const categoryParent = node.isSelected ? node.id : 0;
    this.createEditCategoryForm.controls['parentId'].setValue(categoryParent);
    // this.selectListSelection.toggle(node.isSelected)
  }

  getNode(id: number): CategoryFlatNode | null {
    return this.treeControl.dataNodes.find(n => n.id === id) || null;
  }

}
