import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DropService } from '../../services/drop.service';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  fileList: File[];

  constructor(private drop: DropService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.drop.fileList$.subscribe((fileList) => {
      this.fileList = fileList;
      this.cd.markForCheck();
    });
  }

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fileList, event.previousIndex, event.currentIndex);
    this.drop.updateList(this.fileList);
  }
}
