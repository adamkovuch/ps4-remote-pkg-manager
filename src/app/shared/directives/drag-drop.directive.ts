import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  
  @Output()
  fileDrop = new EventEmitter<File[]>();

  @HostBinding('class.fileover') 
  fileOver = false;

  @HostListener('dragover', ['$event'])
  @HostListener('dragenter', ['$event'])
  onDragOver(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = false;
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  onDragDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    if(evt.dataTransfer.files.length > 0) {
      this.fileDrop.emit(Array.from(evt.dataTransfer.files));
    }
  }
}
