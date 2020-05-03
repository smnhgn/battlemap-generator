import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { LayerService } from '../../services/layer.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Layer } from '../../models/layer.model';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  @Input() layerList: Layer[];

  constructor(private layerService: LayerService) {}

  ngOnInit(): void {}

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layerList, event.previousIndex, event.currentIndex);
    this.layerService.updateList(this.layerList);
  }

  change(event: MatSliderChange) {
    this.layerService.updateList(this.layerList);
  }

  duplicateLayer(layer: Layer) {
    console.log('duplicateLayer', layer);
    this.layerService.duplicateLayer(layer);
  }
}
