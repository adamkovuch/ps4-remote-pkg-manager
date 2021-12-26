import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectComponent } from './connect.component';
import { ConnectRoutingModule } from './connect-routing.module';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ConnectComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    ConnectRoutingModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ConnectModule { }
