import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private fileListSubject = new BehaviorSubject<File[]>([]);
  fileList$ = this.fileListSubject
    .asObservable()
    .pipe(debounceTime(100), shareReplay(1));

  constructor() {}

  addFile(file: File) {
    const fileList = this.fileListSubject.value;
    fileList.push(file);
    this.updateList(fileList);
  }

  updateList(fileList: File[]) {
    this.fileListSubject.next(fileList);
  }
}
