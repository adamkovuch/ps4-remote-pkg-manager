import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { AppDialogData } from '../components/input-dialog/input-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private dialog: MatDialog, private ngZone: NgZone) { }

  handle(info: string, error?: Error) {
    let text = `${info}`;
    if(error) text = `${text}\nError: [${error.name}] ${error.message}`;

    const data: AppDialogData = {
      text,
      title: 'Error',
      okButton: 'OK',
    }

    this.ngZone.run(() => this.dialog.open(ConfirmDialogComponent, {data}));
  }
}
