import { Component, inject, model, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Options, Options2Create } from 'src/app/modules/management/model/options.model';

export interface DialogData {
  title: string;
  option: Options;
}

@Component({
  selector: 'app-create-edit-option-dialog',
  templateUrl: './create-edit-option-dialog.component.html',
  styleUrl: './create-edit-option-dialog.component.scss',
})
export class CreateEditOptionDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditOptionDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  option: Options = this.data.option ?? new Options2Create();

  constructor() {
  }

  ngOnInit(): void {

  }

  onButtonClick() {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
