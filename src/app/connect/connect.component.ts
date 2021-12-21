import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import { SettingsComponent } from '../settings/settings.component';
import { AppSettingsService } from '../shared/services/app-settings.service';
import { Ps4RemoteService } from '../shared/services/ps4-remote.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectComponent implements OnInit, OnDestroy, AfterViewInit {
  form = new FormGroup({
    address: new FormControl('', [this.ipValidation.bind(this)])
  });

  error$ = new BehaviorSubject(false);

  get ipAddress() {
    return this.form.get('address')?.value;
  }

  private destroyed$ = new Subject<void>();

  constructor(
    private router: Router, 
    private ps4RemoteService: Ps4RemoteService,
    private dialog: MatDialog,
    private appSettingsService: AppSettingsService) { }
  
  
  ngOnInit(): void {
    this.redirectIfConnected();
    if(!this.appSettingsService.hasSettings()) {
      this.openSettings();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    const lastIp = this.appSettingsService.getSettings().lastIp;
    if(lastIp) {
      const addressControl = this.form.get('address');
      addressControl.setValue(lastIp);
    }
  }

  submit() {
    if(this.form.invalid) return;

    this.form.disable();
    this.ps4RemoteService.ping(this.ipAddress).pipe(
      finalize(() => this.form.enable()),
      takeUntil(this.destroyed$),
    ).subscribe(result => {
      if(result) {
        this.ps4RemoteService.connect(this.ipAddress);
        const settings = this.appSettingsService.getSettings();
        settings.lastIp = this.ipAddress;
        this.appSettingsService.setSettings(settings);
        this.redirectIfConnected();
      } else {
        this.error$.next(true);
      }
    })
  }

  openSettings() {
    this.dialog.open(SettingsComponent);
  }

  private redirectIfConnected() {
    if(this.ps4RemoteService.connected$.getValue()) {
      this.router.navigate(['home']);
    }
  }

  private ipValidation(control: FormControl) {
    if(control.value?.split('.')?.length !== 4) {
      return { invalid: true };
    }
    return null;
  }
}