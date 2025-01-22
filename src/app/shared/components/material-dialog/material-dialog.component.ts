import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  title: string;
  content: string;
  btn: any[];
  icon: any;
}

@Component({
  selector: 'app-material-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogClose, CommonModule],
  templateUrl: './material-dialog.component.html',
  styleUrl: './material-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<MaterialDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  constructor() { }

  ngOnInit(): void { }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
