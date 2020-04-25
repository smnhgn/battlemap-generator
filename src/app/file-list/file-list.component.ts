import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { DropService } from '../../services/drop.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  @Input() fileList: File[];

  constructor(private drop: DropService) {}

  ngOnInit(): void {}

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fileList, event.previousIndex, event.currentIndex);
    this.drop.updateList(this.fileList);
  }
}
