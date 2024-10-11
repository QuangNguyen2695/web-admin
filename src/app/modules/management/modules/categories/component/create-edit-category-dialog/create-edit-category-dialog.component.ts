import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category, Category2Create } from 'src/app/modules/management/model/categories.model';

export interface DialogData {
  title: string;
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

  constructor() { }

  ngOnInit(): void { }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
