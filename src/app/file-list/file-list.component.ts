import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { DropService } from '../../services/drop.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Layer } from '../../models/layer.model';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  @Input() layerList: Layer[];

  constructor(private drop: DropService) {}

  ngOnInit(): void {}

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layerList, event.previousIndex, event.currentIndex);
    this.drop.updateList(this.layerList);
  }
}
