import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { BrowseFileService } from '../shared/services/browse-file.service';
import { FileHostingService } from '../shared/services/file-hosting.service';
import { Ps4RemoteService } from '../shared/services/ps4-remote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed$ = new Subject<void>();

  constructor(
    private router: Router, 
    private ps4RemoteService: Ps4RemoteService,
    private browseFileService: BrowseFileService,
    private fileHosting: FileHostingService) { }
  

  ngOnInit(): void {
    if(!this.ps4RemoteService.connected$.getValue()) {
      this.router.navigate(['connect']);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addFile() {
    this.browseFileService.open({
      multiple: true,
      accept: ['.pkg']
    }).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(files => {
      files.forEach(file => this.fileHosting.addFile(file.path, file.name));
    });
  }
}
