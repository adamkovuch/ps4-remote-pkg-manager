import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, shell, dialog, App, BrowserWindow } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as webtorrent from 'webtorrent';
import * as express from 'express';
import * as http from 'http';
import * as os from 'os';
import * as parseTorrent from 'parse-torrent';
import * as pump from 'pump';
import * as rangeParser from 'range-parser';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  appDataPath: string;

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  webTorrentLib: typeof webtorrent
  express: typeof express;
  http: typeof http;
  os: typeof os;
  shell: typeof shell;
  dialog: typeof dialog;
  parseTorrent: typeof parseTorrent;

  mime: any;
  pump: typeof pump;
  rangeParser: typeof rangeParser;

  constructor() {
    // Conditional imports
    if (this.isElectron) {

      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.shell = window.require('electron').shell;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.express = window.require('express');
      this.http = window.require('http');
      this.os = window.require('os');
      this.dialog = window.require('@electron/remote').dialog;

      this.parseTorrent = window.require('parse-torrent');
      this.webTorrentLib = window.require('webtorrent');

      this.mime = window.require('mime');
      this.pump = window.require('pump');
      this.rangeParser = window.require('range-parser');

      this.ipcRenderer.once('asynchronous-message', (evt, messageObj) => {
        this.appDataPath = messageObj.appDataPath;
      });

      this.ipcRenderer.send('asynchronous-message', 'getAppSettings');
      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
