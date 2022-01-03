import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  get settings() {
    return this.loadedSettings;
  }

  private readonly storageKey = 'appSettings';

  private loadedSettings: AppSettings = {
    connection: {
      httpPort: 8081,
      interface: null,
      torrentPath: null
    },
    lastIp: null,
  };

  constructor() { 
    const rawSettings = localStorage.getItem(this.storageKey);

    if(rawSettings) {
      this.loadedSettings = JSON.parse(rawSettings);
    }
  }

  setSettings(settings: AppSettings) {
    this.loadedSettings = settings;
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  hasSettings() {
    return !!localStorage.getItem(this.storageKey);
  }
}
