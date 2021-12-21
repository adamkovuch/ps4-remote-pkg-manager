import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsComponent } from '../../settings/settings.component';
import { Ps4RemoteService } from '../../shared/services/ps4-remote.service';

@Component({
  selector: 'app-home-status-toolbar',
  templateUrl: './home-status-toolbar.component.html',
  styleUrls: ['./home-status-toolbar.component.scss']
})
export class HomeStatusToolbarComponent implements OnInit {
  ip: string;

  constructor(
    private ps4Service: Ps4RemoteService,
    private router: Router,
    private dialog: MatDialog) { 
  }

  ngOnInit(): void {
    this.ip = this.ps4Service.ip;
  }

  disconnectClick() {
    this.ps4Service.disconnect();
    this.router.navigate(['connect']);
  }
}
