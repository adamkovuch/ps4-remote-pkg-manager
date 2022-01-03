import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, forkJoin, interval, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ElectronService } from '../core/services';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogData, InputDialogComponent } from '../shared/components/input-dialog/input-dialog.component';
import { TorrentFileSelectComponent, TorrentFileSelectData } from '../shared/components/torrent-file-select/torrent-file-select.component';
import { PkgTask, PkgTaskSource } from '../shared/models/pkg-task';
import { BrowseFileService } from '../shared/services/browse-file.service';
import { FileHostingService } from '../shared/services/file-hosting.service';
import { Ps4RemoteService } from '../shared/services/ps4-remote.service';
import { TorrentService } from '../shared/services/torrent.service';
import { HomeDataListService } from './home-data-list/home-data-list.service';

import convertSize from "convert-size";
import { Torrent } from 'webtorrent';
import { HttpServerService } from '../shared/services/http-server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {

  loading$ = new BehaviorSubject(false);

  private destroyed$ = new Subject<void>();

  constructor(
    public dataListService: HomeDataListService,
    private router: Router,
    private ps4RemoteService: Ps4RemoteService,
    private browseFileService: BrowseFileService,
    private fileHosting: FileHostingService,
    private dialog: MatDialog,
    private electronService: ElectronService,
    private torrentService: TorrentService,
    private httpServerService: HttpServerService) { }


  ngOnInit(): void {
    if (!this.ps4RemoteService.connected$.getValue()) {
      this.router.navigate(['connect']);
    }
    this.httpServerService.startServer();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();

    this.httpServerService.stopServer();
  }

  openLink(link: string) {
    if (this.electronService.isElectron) {
      this.electronService.shell.openExternal(link);
    } else {
      window.open(link, 'blank');
    }
  }

  delete(item: PkgTask) {
    const data: AppDialogData = {
      title: 'Delete',
      text: 'Do you want to delete this item? It will stop uploading to your PS4',
      cancelButton: 'Cancel',
      okButton: 'Delete',
    };
    this.dialog.open(ConfirmDialogComponent, { data }).afterClosed().pipe(
      filter((result) => result),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.dataListService.delete(item);

      switch (item.source) {
        case PkgTaskSource.file:
          this.fileHosting.removeFile(item.name);
          break;
        case PkgTaskSource.torrent:
          this.torrentService.deleteTorrentFile(item.name, item.torrentData.torrent, item.torrentData.torrentFile);
          break;
      }
    });
  }

  addFile() {
    this.browseFileService.open({
      multiple: true,
      accept: ['.pkg']
    }).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(files => this.addFilesToList(files));
  }

  addDirectLink() {
    const data: AppDialogData = {
      title: 'Add Direct Link',
      text: 'Please enter direct url to download .pkg file. (e.g. http://somedomain.com/somefile.pkg)',
      okButton: 'Add',
      cancelButton: 'Cancel',
      placeholder: 'Url'
    };
    this.dialog.open(InputDialogComponent, {
      data
    }).afterClosed().pipe(
      filter(result => !!result),
      takeUntil(this.destroyed$),
    ).subscribe((result: string) => {
      const linkParts = result.split('/');
      const name = linkParts[linkParts.length - 1];
      this.dataListService.add({
        link: result,
        source: PkgTaskSource.link,
        name: name,
      });
    });
  }

  addTorrent() {
    this.browseFileService.open({
      multiple: false,
      accept: ['.torrent']
    }).pipe(
      switchMap(files => this.addTorrentToList(files)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  addMagnetUri() {
    const data: AppDialogData = {
      title: 'Add Magnet URI',
      text: 'Please enter magnet URI',
      cancelButton: 'Cancel',
      okButton: 'Add',
      placeholder: 'URI',
    };



    this.dialog.open(InputDialogComponent, { data }).afterClosed().pipe(
      tap(() => this.loading$.next(true)),
      filter(result => result),
      switchMap((result: string) => this.torrentService.addTorrent(result, false)),
      switchMap(torrent => this.processTorrent(torrent)),
      finalize(() => this.loading$.next(false)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  onFileDrop(files: File[]) {
    files.forEach(file => {
      if (file.name.endsWith('.pkg')) {
        this.addFilesToList([file]);
      } else if (file.name.endsWith('.torrent')) {
        this.addTorrentToList([file]).pipe(takeUntil(this.destroyed$)).subscribe();
      }
    });
  }

  forceDownload(item: PkgTask) {
    this.torrentService.forceDownload(item.torrentData.torrent, item.torrentData.torrentFile);
  }

  sendToPs4(pkgTask: PkgTask) {
    this.installPkgs([pkgTask.link]);
  }

  private addFilesToList(files: File[]) {
    files.forEach(file => {
      const result = this.fileHosting.addFile(file.path, file.name);
      this.dataListService.add({
        name: result.name,
        source: PkgTaskSource.file,
        link: result.link,
        size: this.getSize(file.size),
      });
    });
  }

  private addTorrentToList(files: File[]) {
    this.loading$.next(true);

    return forkJoin(files.map(file => this.torrentService.addTorrent(file.path, true).pipe(
      switchMap(torrent => this.processTorrent(torrent)),
    ))).pipe(
      finalize(() => this.loading$.next(false)),
      takeUntil(this.destroyed$),
    );
  }

  private getSize(size: number): string {
    return convertSize(size, { accuracy: 2 });
  }

  private processTorrent(torrent: Torrent) {
    const dataSource: TorrentFileSelectData[] = torrent.files
      .filter(torrentFile => torrentFile.name.endsWith('.pkg'))
      .map(torrentFile => ({ name: torrentFile.name, size: this.getSize(torrentFile.length), selected: true }))

    return this.dialog.open(TorrentFileSelectComponent, { data: dataSource }).afterClosed().pipe(
      map((result: TorrentFileSelectData[]) => ({ dialogResult: result, torrent })),
      filter(result => !!result.dialogResult),
      tap(result => {
        const selectedFiles = result.dialogResult.filter(file => file.selected).map(file => file.name);
        const resultInfo = this.torrentService.startDownloading(result.torrent, selectedFiles);
        const urls = [];
        resultInfo.forEach(info => {
          const progressUpdater$ = interval(1000).pipe(
            map(() => (info.file.progress * 100).toFixed(2)),
            tap(() => {
              if (info.file.progress >= 1) {
                this.torrentService.forceDownload(torrent);
              }
            }),
            filter(() => info.file.progress < 1),
            takeUntil(this.destroyed$),
          );

          if (!this.dataListService.isExists(info.file.name)) {
            urls.push(info.url);
            this.dataListService.add({
              name: info.file.name,
              link: info.url,
              source: PkgTaskSource.torrent,
              size: this.getSize(info.file.length),
              torrentData: {
                torrent: result.torrent,
                torrentFile: info.file,
                progress$: progressUpdater$
              }
            });
          }
        });
      })
    );
  }

  private installPkgs(urls: string[]) {
    this.loading$.next(true);
    this.ps4RemoteService.install(urls).pipe(
      finalize(() => this.loading$.next(false)),
      catchError(() => of(null)),
      takeUntil(this.destroyed$),
    ).subscribe(result => {
      let data: AppDialogData;
      if (result) {
        data = {
          text: "The package has been sent successfully",
          title: "Send to PS4",
          okButton: "OK",
        };
      } else {
        data = {
          text: "Error sending the package",
          title: "Send to PS4",
          okButton: "OK",
        };
      }

      this.dialog.open(ConfirmDialogComponent, { data });
    });
  }
}
