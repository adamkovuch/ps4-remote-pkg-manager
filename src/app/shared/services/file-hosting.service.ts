import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services';
import { Server } from "http";
import * as express from "express";

@Injectable({
  providedIn: 'root'
})
export class FileHostingService {
  private app: express.Application;
  private server: Server;
  constructor(electronService: ElectronService) { 
    this.app = electronService.express?.();
    this.server = electronService.http?.createServer(this.app);
    this.server?.listen(8081);
  }

  addFile(path: string, name: string) {
    const normalizedName = name.replace(/[^a-zA-Z0-9-_.]/g, '');

    this.app?.get(`/${normalizedName}`, function(request, response){
      response.status(200).download(path, normalizedName);
    });
  }
}
