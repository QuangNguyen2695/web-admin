import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { Category, Category2Create, CategoryFlatNode, CategoryTreeNode } from 'src/app/modules/management/model/categories.model';

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
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level,
          disabled: !!node.disabled
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

  constructor() { }

  ngOnInit(): void {
    console.log("this.data.listCategories", this.data.listCategories);
    this.treeFlattener = new NzTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.setData(this.data.listCategories);
  }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
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
}
