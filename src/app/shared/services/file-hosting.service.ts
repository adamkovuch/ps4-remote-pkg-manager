import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ElectronService } from '../../core/services';
import { Server } from "http";
import * as express from "express";
import { AppSettingsService } from './app-settings.service';
import { ErrorHandlerService } from './error-handler.service';
import { SharedServer } from './shared-server';

@Injectable({
  providedIn: 'root'
})
export class FileHostingService extends SharedServer implements OnDestroy {
  
  protected get port(): number {
    return this.appSettingsService.settings.connection.httpPort;
  }
  protected get inteface(): string {
    return this.appSettingsService.settings.connection.interface;
  }

  private app: express.Application;
  private routes: string[] = [];

  constructor(
    electronService: ElectronService, 
    private appSettingsService: AppSettingsService,
    private errorHandler: ErrorHandlerService) {

    super();
    this.app = electronService.express?.();
    this.server = electronService.http?.createServer(this.app);
    this.server?.on('error', (err) => 
      this.errorHandler.handle('Unable to create http server. Please check the app settings', err)
    );
  }

  ngOnDestroy(): void {
    this.server?.close();
  }

  addFile(path: string, name: string) {
    const normalizedName = name.replace(/[^a-zA-Z0-9-_.]/g, '');
    const route = this.getUniqueRoute(normalizedName);

    this.app?.get(`/${route}`, function(request, response){
      response.status(200).download(path, route);
    });

    this.routes.push(route);
    const link = `http://${this.appSettingsService.settings.connection.interface}:${this.appSettingsService.settings.connection.httpPort}/${route}`;
    console.log(`file hosted. Link: ${link}`);

    return {
      link,
      name: route,
    };
  }

  removeFile(name: string) {
    if(this.routes.find(route => route === name)) {
      this.app?.get(`/${name}`, function(request, response){
        response.sendStatus(404);
      });

      const index = this.routes.findIndex(route => route === name);
      this.routes.splice(index, 1);
    }
  }

  private getUniqueRoute(route: string, index?: number) {
    const nameParts = route.split('.');
    let routeName = route;
    if(typeof index === 'number') {
      nameParts.splice(nameParts.length-2, 0, `${index}`);
      routeName = nameParts.join('.');
    }
    if(this.routes.find(r => r === routeName)) {
      return this.getUniqueRoute(route, (index || 0) + 1);
    }
    return routeName;
  }
}
