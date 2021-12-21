import { Injectable, OnDestroy } from '@angular/core';
import { first, fromEvent, of, Subject, takeUntil } from 'rxjs';
import { ElectronService } from '../../core/services';

export interface BrowseFileOptions {
  multiple?: boolean;
  accept?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BrowseFileService implements OnDestroy {
  private readonly inputElement: HTMLInputElement;
  private destroyed$ = new Subject<void>();
  private fileSelected$: Subject<File[]>;

  constructor() {
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('type', 'file');
    this.inputElement.setAttribute('style', 'display: none');

    document.body.appendChild(this.inputElement);

    fromEvent(this.inputElement, 'change').pipe(
      takeUntil(this.destroyed$)
    ).subscribe((ev: any) => this.fileSelected$?.next(this.toArray(ev.target.files)));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  open(options?: BrowseFileOptions) {
    options?.multiple ? this.inputElement.setAttribute('multiple', '') : this.inputElement.removeAttribute('multiple');
    options?.accept ? this.inputElement.setAttribute('accept', options?.accept.join(', ')) : this.inputElement.removeAttribute('accept');
    this.fileSelected$ = new Subject();
    
    this.inputElement.click();

    return this.fileSelected$.asObservable().pipe(first());
  }

  private toArray(files: FileList) {
    const result: File[] = [];
    for(let i = 0; i < files.length; i += 1) {
      result.push(files.item(i));
    }
    return result;
  }
}
