import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';
import { isFileEntry, isDirectoryEntry } from '../utils/file.utils';

@Directive({
  selector: '[appFileDrop]',
})
export class FileDropDirective {
  constructor() {}

  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.border') private border = '2px dashed cornflowerblue';
  @HostBinding('style.color') private color = 'cornflowerblue';
  @HostBinding('style.border-radius') private borderRadius = '5px';
  @HostBinding('style.opacity') private opacity = '1';

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '2px solid cornflowerblue';
    this.opacity = '0.8';
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '2px dashed cornflowerblue';
    this.opacity = '1';
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '2px dashed cornflowerblue';
    this.opacity = '1';
    // let files = evt.dataTransfer.files;
    // console.log(evt, files);
    // if (files.length > 0) {
    //   this.onFileDropped.emit(files);
    // }

    var items = evt.dataTransfer.items;
    for (var i = 0; i < items.length; i++) {
      // webkitGetAsEntry is where the magic happens
      var item = items[i].webkitGetAsEntry();
      if (item) {
        this.saveFiles(item);
        // if (files.length > 0) {

        // }
      }
    }
  }

  saveFiles(item: Entry) {
    if (isFileEntry(item)) {
      item.file((file) => this.onFileDropped.emit(file));
    } else if (isDirectoryEntry(item)) {
      const dirReader = item.createReader();
      dirReader.readEntries(
        (entries) => {
          for (const entry of entries) {
            this.saveFiles(entry);
          }
        },
        (error) => console.error(error)
      );
    }
  }
}
