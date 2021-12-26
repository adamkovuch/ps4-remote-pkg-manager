import { Injectable, OnDestroy } from '@angular/core';
import { Instance, Torrent, TorrentFile } from 'webtorrent';
import { ElectronService } from '../../core/services';
import { AppSettingsService } from './app-settings.service';

import * as express from 'express';
import { Server } from 'http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
import { WebTorrent } from "webtorrent";
import { SharedServer } from './shared-server';

import { Ranges } from "range-parser";

interface TorrentInfo {
  url: string;
  file: TorrentFile;
}

interface TorrentBindingSelectedFile {
  url: string;
  torrentFile: TorrentFile;
  streams: NodeJS.ReadableStream[];
}

interface TorrentBinding {
  instance: Torrent;
  selectedFiles: TorrentBindingSelectedFile[];
}

@Injectable({
  providedIn: 'root'
})
export class TorrentService extends SharedServer implements OnDestroy {
  protected get port(): number {
    return this.appSettings.settings.connection.torrentPort;
  }
  protected get inteface(): string {
    return this.appSettings.settings.connection.interface;
  }

  private client?: Instance;
  private app?: express.Application;

  private torrents: TorrentBinding[] = [];

  constructor(
    private electronService: ElectronService,
    private appSettings: AppSettingsService,
    private errorHandler: ErrorHandlerService) {

    super();
    this.app = electronService.express?.();
    this.server = electronService.http?.createServer(this.app);

    this.server?.on('error', (err) =>
      this.errorHandler.handle('Unable to create http torrent server. Please check the app settings', err)
    );
    this.client = electronService.webTorrentLib && new electronService.webTorrentLib();

    this.initServer();
  }

  ngOnDestroy(): void {
    this.server?.close();
    this.client?.destroy();
  }

  addTorrent(file: string, isFile: boolean): Observable<Torrent> {
    return new Observable(ob => {
      let torrentId: any;
      if (isFile) {
        torrentId = this.electronService.fs.readFileSync(file);
      } else {
        torrentId = file;
      }

      this.electronService.parseTorrent.remote(torrentId, (err) => {
        if (err) {
          this.errorHandler.handle('Invalid torrent');
          ob.error(err);
          ob.complete();
          return;
        }

        const existTorrent = this.client.get(torrentId);
        if (existTorrent) {
          ob.next(existTorrent);
          ob.complete();
        } else {
          try {
            this.client?.add(torrentId, { path: this.appSettings.settings.connection.torrentPath }, torrent => {
              /*const s = torrent.createServer();
              s.listen(this.appSettings.settings.connection.torrentPort, this.appSettings.settings.connection.interface);
              s.on('request', (req) => {
                console.log(`Path: ${req.url}`);
                console.log(`Headers: ${JSON.stringify(req.headers)}`);
              });*/
              torrent.files.forEach(file => file.deselect());
              //torrent.deselect(0, torrent.pieces.length - 1, 0);
              ob.next(torrent);
              ob.complete();
            });
          } catch (err) {
            console.log('my error');
          }
        }
      })

    });
  }

  startDownloading(torrent: Torrent, filenames: string[]) {
    const files: TorrentInfo[] = [];

    torrent.files.forEach((file: TorrentFile) => {
      if (filenames.find(name => name === file.name)) {
        const path = `/${torrent.infoHash}/${file.name}`;
        this.app.get(path, (req, res) =>
          this.handleRequest(file, req, res)
        );
        files.push({
          url: this.getFileUrl(torrent.infoHash, file.name),
          file: file,
        });
        this.forceDownload(torrent, file);
        console.log(`created: ${this.getFileUrl(torrent.infoHash, file.name)}`);
      }
    });

    const selectedFiles = files.map(x => ({ torrentFile: x.file, streams: [], url: `/${torrent.infoHash}/${x.file.name}` }));

    const binding: TorrentBinding = {
      instance: torrent,
      selectedFiles: selectedFiles,
    };
    this.torrents.push(binding);

    return files;
  }

  deleteTorrentFile(filename: string, torrent: Torrent, torrentFile: TorrentFile) {
    this.app.get(`/${torrent.infoHash}/${filename}`, (req, res) =>
      res.status(404).send('not found')
    );
    torrentFile.deselect();
    const params = { delete: false };
    this.torrents.forEach(torrent => {
      const file = torrent.selectedFiles.find(file => file.torrentFile === torrentFile);
      if (file) {
        file.streams.forEach(stream => stream.unpipe());
        const index = torrent.selectedFiles.findIndex(value => value === file);
        torrent.selectedFiles.splice(index, 1);

        if (torrent.selectedFiles.length > 0) {
          this.forceDownload(torrent.instance, torrent.selectedFiles[0].torrentFile);
        } else {
          params.delete = true;
        }
      }
    });

    const index = this.torrents.findIndex(t => t.instance === torrent);
    this.torrents.splice(index, 1);
  }

  forceDownload(torrent: Torrent, file: TorrentFile) {
    // Deselect all files on initial download
    torrent.files.forEach(file => file.deselect());
    torrent.deselect(0, torrent.pieces.length - 1, 0);

    // Select file with provided index
    torrent.select((file as any)._startPiece, (file as any)._endPiece, 0); // workaround
  }

  private handleRequest(file: TorrentFile, req: express.Request, res: express.Response) {
    res.setHeader('Content-Type', this.electronService.mime.getType(file.name) || 'application/octet-stream')
    res.setHeader('Accept-Ranges', 'bytes')

    res.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${this.encodeRFC5987(file.name)}`
    )

    // Support DLNA streaming
    res.setHeader('transferMode.dlna.org', 'Streaming')
    res.setHeader(
      'contentFeatures.dlna.org',
      'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
    );

    let range: any = this.electronService.rangeParser(file.length, req.headers.range || '') as any;

    if (Array.isArray(range)) {
      res.statusCode = 206 // indicates that range-request was understood

      // no support for multi-range request, just use the first range
      range = range[0];

      res.setHeader(
        'Content-Range',
        `bytes ${range.start}-${range.end}/${file.length}`
      )
      res.setHeader('Content-Length', range.end - range.start + 1)
    } else {
      res.statusCode = 200
      range = null
      res.setHeader('Content-Length', file.length)
    }

    if (req.method === 'HEAD') {
      return res.end()
    }

    const stream = file.createReadStream(range);
    this.electronService.pump(stream, res)

    this.torrents.forEach(torrent => {
      const fileInfo = torrent.selectedFiles.find(f => f.torrentFile === file);
      if (fileInfo) {
        fileInfo.streams.push(stream);
      }
    });
  }

  private initServer() {
    this.app?.get('', (req, res) => {
      const body = this.client.torrents.map(torrent => {
        const links = torrent.files.map(file => `<div><a href="${this.getFileUrl(torrent.infoHash, file.name)}">${file.name}</a></div>`)
        return `<div><h2>${torrent.name}<h2>${links.join('')}</div><br /><br/>`;
      }).join();
      res.status(200).send(body);
    });
  }

  private getFileUrl(infoHash: string, filename: string) {
    return `http://${this.appSettings.settings.connection.interface}:${this.appSettings.settings.connection.torrentPort}/${infoHash}/${filename}`;
  }

  private encodeRFC5987(str) {
    return encodeURIComponent(str)
      // Note that although RFC3986 reserves "!", RFC5987 does not,
      // so we do not need to escape it
      .replace(/['()]/g, escape) // i.e., %27 %28 %29
      .replace(/\*/g, '%2A')
      // The following are not required for percent-encoding per RFC5987,
      // so we can allow for a little better readability over the wire: |`^
      .replace(/%(?:7C|60|5E)/g, unescape)
  }
}