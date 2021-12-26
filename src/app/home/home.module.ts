import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { I18nModule } from '../i18n/i18n.module';
import { HomeStatusToolbarComponent } from './home-status-toolbar/home-status-toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { HomeDataListComponent } from './home-data-list/home-data-list.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputDialogComponent } from '../shared/components/input-dialog/input-dialog.component';
import { TorrentFileSelectComponent } from '../shared/components/torrent-file-select/torrent-file-select.component';
import { SharedModule } from '../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    HomeComponent, 
    HomeStatusToolbarComponent, 
    HomeDataListComponent
  ],
  imports: [
    CommonModule, 
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    SharedModule,
  ]
})
export class HomeModule {}
