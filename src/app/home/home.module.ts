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
import { HomeDataListComponent } from './home-data-list/home-data-list.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { SettingsComponent } from '../settings/settings.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent, 
    HomeStatusToolbarComponent, 
    HomeDataListComponent,
    ConfirmDialogComponent,
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
    MatInputModule,
    MatSelectModule,
  ]
})
export class HomeModule {}
