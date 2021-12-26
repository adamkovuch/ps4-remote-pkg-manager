import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppDialogData } from '../input-dialog/input-dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  
  get title() {
    return this.data.title;
  }

  get text() {
    return this.data.text;
  }

  get okButton() {
    return this.data.okButton;
  }

  get cancelButton() {
    return this.data.cancelButton;
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: AppDialogData) { }

}
