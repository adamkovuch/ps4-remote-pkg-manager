import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogData } from '../../shared/components/input-dialog/input-dialog.component';
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
    private dialog: MatDialog) { 
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
      const data: AppDialogData = {
        title: 'Test connection',
        text: result ? 'Connection OK' : 'Connection failed',
        okButton: 'OK'
      };
      this.dialog.open(ConfirmDialogComponent, {
        data
      });
    });
  }
}
