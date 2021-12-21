import { Injectable, OnDestroy } from '@angular/core';
import { Server } from 'http';
import { Instance } from 'webtorrent';
import { ElectronService } from '../../core/services';

@Injectable({
  providedIn: 'root'
})
export class TorrentService implements OnDestroy {
  private client?: Instance;
  private server?: Server;
  private test = `magnet:?xt=urn:btih:9B3410BA81F7C2C989C0F76F787A84E4F122BAE7&dn=Worms%20W.M.D%20v1.11&tr=http%3a%2f%2fbt2.t-ru.org%2fann&tr=http%3a%2f%2fretracker.local%2fannounce`;
  
  constructor(electronService: ElectronService) {
    this.client = electronService.webTorrentLib && new electronService.webTorrentLib({});
  }

  ngOnDestroy(): void {
    this.server?.close();
    this.client?.destroy();
  }

  start() {
    this.client?.add(this.test, torrent => {
      this.server = torrent.createServer();
      this.server.listen(8090);
      torrent.files.forEach((file: any, index: number) => {
        console.log(`index: ${index}`);
        console.log(`file: ${file.name}`);
      });
    });
  }

  
}