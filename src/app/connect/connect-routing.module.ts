import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConnectComponent } from './connect.component';

const routes: Routes = [
  {
    path: 'connect',
    component: ConnectComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectRoutingModule {}
