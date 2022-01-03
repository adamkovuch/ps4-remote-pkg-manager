import { Injectable, OnDestroy } from '@angular/core';
import { Server } from 'http';
import { ElectronService } from '../../core/services';
import { AppSettingsService } from './app-settings.service';
import * as express from 'express';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HttpServerService implements OnDestroy {
  private server: Server;
  private app: express.Application;

  private errorInvoker: (err: Error) => void;

  readonly routes: string[] = [];

  get port(): number {
    return this.appSettings.settings.connection.httpPort;
  }
  get interface(): string {
    return this.appSettings.settings.connection.interface;
  }

  constructor(private appSettings: AppSettingsService, electronService: ElectronService, private errorHandler: ErrorHandlerService) {
    this.app = electronService.express?.();
    this.server = electronService.http?.createServer(this.app);

    this.errorInvoker = this.onError.bind(this);
    this.server?.on('error', this.errorInvoker);

    this.initIndex();
  }

  ngOnDestroy(): void {
    this.server?.removeAllListeners();
    this.stopServer();
  }

  startServer() {
    if (this.server && !this.server.listening) {
      this.server.listen(this.port, this.interface);
      console.log(`Http server started on port ${this.port}`);
    }
  }

  stopServer() {
    if (this.server && this.server.listening) {
      this.server.close();
      console.log(`Http server stopped on port ${this.port}`);
    }
  }

  addGetRoute(route: string, handler: (req: express.Request, res: express.Response) => void) {
    this.app?.get(route, handler);
    this.routes.push(route);

    return this.getFullUrl(route);
  }

  removeGetRoute(route: string): boolean {
    const index = this.routes.findIndex(r => r === route);

    if (index >= 0) {
      this.app?.get(route, (req, res) => res.sendStatus(404));
      this.routes.splice(index, 1);
      return true;
    }

    return false;
  }

  private onError(err: Error) {
    this.errorHandler.handle('Unable to create http server. Please check the app settings', err)
  }

  private initIndex() {
    this.app?.get('', (req, res) => {
      const links = this.routes.map(route => {
        const url = this.getFullUrl(route);
        return `<div><a href="${url}">${url}</a></div>`
      }).join();

      const body = `<h1>All files</h1>${links}`;
      res.status(200).send(body);
    });
  }

  private getFullUrl(route: string) {
    return `http://${this.appSettings.settings.connection.interface}:${this.appSettings.settings.connection.httpPort}${route}`;
  }
}
