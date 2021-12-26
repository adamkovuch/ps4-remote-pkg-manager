import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ElectronService } from '../core/services';
import { AppSettings } from '../shared/models/app-settings';
import { AppSettingsService } from '../shared/services/app-settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  interfaces: string[];

  settingForm = new FormGroup({
    interface: new FormControl(''),
    httpPort: new FormControl(''),
    torrentPath: new FormControl(''),
    torrentPort: new FormControl(''),
  });

  private loadedSettings: AppSettings;

  constructor(
    private electronService: ElectronService, 
    private dialogRef: MatDialogRef<SettingsComponent>,
    private appSettingsService: AppSettingsService) { 
    const interfaces = electronService.os?.networkInterfaces();
    if(interfaces) {
      const addresses = [];
      for (var k in interfaces) {
          for (var k2 in interfaces[k]) {
              var address = interfaces[k][k2];
              if (address.family === 'IPv4' && !address.internal) {
                  addresses.push(address.address);
              }
          }
      }
      this.interfaces = addresses;
    } else {
      this.interfaces = [];
    }
  }

  ngOnInit(): void {
    this.loadedSettings = this.appSettingsService.settings;
    this.settingForm.setValue(this.loadedSettings.connection);
  }

  submit() {
    if(this.settingForm.valid) {
      this.loadedSettings.connection = this.settingForm.value;
      this.appSettingsService.setSettings(this.loadedSettings);
      this.dialogRef.close(true);
    }
  }

  browseFolder() {
    if(this.electronService.isElectron) {
      this.electronService.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(folderPath => {
        this.settingForm.get('torrentPath')?.setValue(folderPath.filePaths[0]);
      })
    }
  }
}
