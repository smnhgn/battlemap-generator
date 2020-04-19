import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private fileListSubject = new BehaviorSubject<File[]>([]);
  fileList$ = this.fileListSubject.asObservable().pipe(debounceTime(300));
  // private collectionListSubject = new BehaviorSubject<File[][]>([]);
  // collectionList$ = this.collectionListSubject.asObservable();

  constructor() {}

  // addCollection(collection: File[]) {
  //   const collectionList = this.collectionListSubject.value;
  //   collectionList.push(collection);
  //   this.collectionListSubject.next(collectionList);
  // }

  addFile(file: File) {
    const fileList = this.fileListSubject.value;
    fileList.push(file);
    this.fileListSubject.next(fileList);
  }
}
