import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { LayerService } from '../../services/layer.service';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { MapComponent } from '../map/map.component';
import { Layer } from '../../models/layer.model';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorComponent implements OnInit {
  layerList: Layer[];
  @ViewChild('map', { read: MapComponent }) map: MapComponent;
  deleteDisabled = true;

  constructor(
    private layerService: LayerService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.layerService.layerList$.subscribe((layerList) => {
      // copy array for change-detection
      this.layerList = [...layerList];
      this.deleteDisabled = this.layerList.every((layer) => !layer.editable);
      this.cd.markForCheck();
      // console.log('update layers', this.layerList);
    });

    // for testing
    const imagePaths = [
      'assets/Grass Field.jpg',
      'assets/Trees/Tree 1.png',
      'assets/Campsite/Tent 1.png',
      'assets/Campsite/Bedroll 1.png',
      'assets/Campsite/Firepit.png',
    ];
    for (const path of imagePaths) {
      const name = path.split('/').pop();
      this.layerService.addLayer(name, path);
    }
  }

  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (file.type.startsWith('image/')) {
            const path = URL.createObjectURL(file);
            this.layerService.addLayer(file.name, path);
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  export() {
    this.map.export();
  }

  deleteLayers() {
    this.layerService.deleteLayers();
  }
}
