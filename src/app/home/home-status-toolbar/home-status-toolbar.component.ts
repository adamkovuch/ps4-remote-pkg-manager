import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import { ElectronService } from '../../core/services';
import { SettingsComponent } from '../../settings/settings.component';
import { Ps4RemoteService } from '../../shared/services/ps4-remote.service';

@Component({
  selector: 'app-home-status-toolbar',
  templateUrl: './home-status-toolbar.component.html',
  styleUrls: ['./home-status-toolbar.component.scss']
})
export class HomeStatusToolbarComponent implements OnInit, OnDestroy {
  ip: string;

  checkingConnection$ = new BehaviorSubject(false);

  private destroyed$ = new Subject<void>();

  constructor(
    private ps4Service: Ps4RemoteService,
    private router: Router,
    private electronService: ElectronService) { 
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.ip = this.ps4Service.ip;
  }

  disconnectClick() {
    this.ps4Service.disconnect();
    this.router.navigate(['connect']);
  }

  testConnection() {
    this.checkingConnection$.next(true);
    this.ps4Service.ping().pipe(
      finalize(() => this.checkingConnection$.next(false)),
      takeUntil(this.destroyed$),
    ).subscribe(result => {
      this.electronService.dialog.showMessageBox(this.electronService.browserWindow, {
        title: 'Test connection',
        message: result ? 'Connection OK' : 'Connection failed'
      });
    });
  }
}
