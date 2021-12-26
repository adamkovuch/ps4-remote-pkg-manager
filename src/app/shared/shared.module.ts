import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './components/input-dialog/input-dialog.component';
import { TorrentFileSelectComponent } from './components/torrent-file-select/torrent-file-select.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    ConfirmDialogComponent, 
    InputDialogComponent, 
    TorrentFileSelectComponent, 
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ConfirmDialogComponent, 
    InputDialogComponent, 
    TorrentFileSelectComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
