import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AppDialogData {
  title?: string;
  text: string;
  okButton?: string;
  cancelButton?: string;
  placeholder?: string;
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent {
  valueControl = new FormControl('');

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

  get placeholder() {
    return this.data.placeholder;
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: AppDialogData) { }

}
