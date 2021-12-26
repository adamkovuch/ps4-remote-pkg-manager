import { Injectable, OnDestroy } from '@angular/core';
import { first, fromEvent, of, Subject, Subscription, takeUntil } from 'rxjs';
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
  private sub: Subscription;

  constructor() {
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('type', 'file');
    this.inputElement.setAttribute('style', 'display: none');

    document.body.appendChild(this.inputElement);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  open(options?: BrowseFileOptions) {
    this.sub?.unsubscribe();
    this.inputElement.value = '';

    options?.multiple ? this.inputElement.setAttribute('multiple', '') : this.inputElement.removeAttribute('multiple');
    options?.accept ? this.inputElement.setAttribute('accept', options?.accept.join(', ')) : this.inputElement.removeAttribute('accept');
    const fileSelected$ = new Subject<File[]>()

    this.sub = fromEvent(this.inputElement, 'change').pipe(
      first(),
      takeUntil(this.destroyed$)
    ).subscribe((ev: any) => fileSelected$?.next(Array.from(ev.target.files)));
    
    this.inputElement.click();

    return fileSelected$.asObservable().pipe(first());
  }
}
