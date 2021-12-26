import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface TorrentFileSelectData {
  name: string;
  size: string;
  selected: boolean;
}

@Component({
  selector: 'app-torrent-file-select',
  templateUrl: './torrent-file-select.component.html',
  styleUrls: ['./torrent-file-select.component.scss']
})
export class TorrentFileSelectComponent {

  dataSource: TorrentFileSelectData[];

  displayedColumns = [
    'check',
    'name',
    'size',
  ]

  constructor(@Inject(MAT_DIALOG_DATA) data: TorrentFileSelectData[]) {
    this.dataSource = data;
  }
}
