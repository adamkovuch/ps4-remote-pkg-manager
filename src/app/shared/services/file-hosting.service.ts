import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ElectronService } from '../../core/services';
import { Server } from "http";
import * as express from "express";
import { AppSettingsService } from './app-settings.service';
import { ErrorHandlerService } from './error-handler.service';
import { HttpServerService } from './http-server.service';

@Injectable({
  providedIn: 'root'
})
export class FileHostingService {
  
  constructor( 
    private appSettingsService: AppSettingsService,
    private httpServerService: HttpServerService) {
  }

  addFile(path: string, name: string) {
    const normalizedName = name.replace(/[^a-zA-Z0-9-_.]/g, '');
    const route = this.getUniqueRoute(normalizedName);

    this.httpServerService.addGetRoute(`/${route}`, (req, res) => {
      res.status(200).download(path, route);
    });

    const link = `http://${this.appSettingsService.settings.connection.interface}:${this.appSettingsService.settings.connection.httpPort}/${route}`;
    console.log(`file hosted. Link: ${link}`);

    return {
      link,
      name: route,
    };
  }

  removeFile(name: string) {
    this.httpServerService.removeGetRoute(name);
  }

  private getUniqueRoute(route: string, index?: number) {
    const nameParts = route.split('.');
    let routeName = route;
    if(typeof index === 'number') {
      nameParts.splice(nameParts.length-2, 0, `${index}`);
      routeName = nameParts.join('.');
    }
    if(this.httpServerService.routes.find(r => r === routeName)) {
      return this.getUniqueRoute(route, (index || 0) + 1);
    }
    return routeName;
  }
}
