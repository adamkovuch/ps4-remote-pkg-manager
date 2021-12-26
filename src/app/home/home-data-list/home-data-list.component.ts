import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PkgTask } from '../../shared/models/pkg-task';
import convertSize from "convert-size";

@Component({
  selector: 'app-home-data-list',
  templateUrl: './home-data-list.component.html',
  styleUrls: ['./home-data-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeDataListComponent{
  @Input()
  dataSource$: Observable<PkgTask[]>;

  @Output()
  openLink = new EventEmitter<string>();

  @Output()
  delete = new EventEmitter<PkgTask>();

  @Output()
  forceDownload = new EventEmitter<PkgTask>();

  @Output()
  send = new EventEmitter<PkgTask>();

  displayedColumns = [
    "name",
    "source",
    "status",
    "size",
    "send",
    "actions",
  ]

  getStatus(item: PkgTask, progress: string) {
    if(item.torrentData && item.torrentData.torrentFile.progress < 1) {
      return item.torrentData.torrent.paused ? `Paused (${progress || 0}%)` : `Downloading (${progress || 0}%)`;
    }
    return 'Ready';
  }

  allowSend(item: PkgTask) {
    return item.torrentData && item.torrentData.torrentFile.downloaded === 0;
  }

  getTorrentInfo(item: PkgTask) {
    if(item.torrentData) {
      return `Peers: ${item.torrentData.torrent.numPeers}\nDownload speed: ${this.getSize(item.torrentData.torrent.downloadSpeed)}/s`;
    }
    return null;
  }

  private getSize(size: number): string {
    return convertSize(size, { accuracy: 2 });
  }
}
