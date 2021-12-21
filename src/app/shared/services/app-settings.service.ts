import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services';
import { AppSettings } from '../models/app-settings';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private readonly filename = 'config.json';

  private loadedSettings: AppSettings = {
    connection: {
      httpPort: 8081,
      interface: null,
      torrentPath: null
    },
    lastIp: null,
  };

  private fsInstance: typeof fs;

  constructor(electronService: ElectronService) { 
    if(electronService.isElectron) {
      this.fsInstance = electronService.fs;
      if(this.hasSettings()) {
        const rawData = this.fsInstance.readFileSync(this.filename, 'utf8');
        this.loadedSettings = JSON.parse(rawData);
      }
    }
  }

  getSettings(): AppSettings {
    return this.loadedSettings;
  }

  setSettings(settings: AppSettings) {
    this.loadedSettings = settings;
    this.fsInstance?.writeFile(this.filename, JSON.stringify(settings), () => {});
  }

  hasSettings() {
    return this.fsInstance?.existsSync(this.filename)
  }
}
