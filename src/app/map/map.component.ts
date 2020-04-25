import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  Input,
} from '@angular/core';
import { DropService } from '../../services/drop.service';
import { debounceTime } from 'rxjs/operators';
import { CdkDragEnd, CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input() fileList: File[];
  @ViewChildren('layer', { read: CdkDrag })
  layer: QueryList<CdkDrag>;
  @ViewChild('exportCanvas', { static: true })
  exportCanvas: ElementRef<HTMLCanvasElement>;
  exportCtx: CanvasRenderingContext2D;
  scale = 0.25;

  constructor() {}

  ngOnInit(): void {
    this.exportCtx = this.exportCanvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit(): void {
    this.layer.changes.pipe(debounceTime(100)).subscribe(() => this.update());
  }

  dragEnd(event: CdkDragEnd) {
    this.update();
  }

  update() {
    const { width, height } = this.layer.reduce(
      (size, layer) => {
        let { x, y } = layer.getFreeDragPosition();
        x = x / this.scale;
        y = y / this.scale;
        const { width, height } = layer.data.img;
        if (width + x > size.width) {
          size.width = width + x;
        }
        if (height + y > size.height) {
          size.height = height + y;
        }
        return size;
      },
      { width: 0, height: 0 }
    );
    this.exportCanvas.nativeElement.width = width;
    this.exportCanvas.nativeElement.height = height;
    this.exportCtx.clearRect(
      0,
      0,
      this.exportCanvas.nativeElement.width,
      this.exportCanvas.nativeElement.height
    );
    this.layer.forEach((layer) => {
      const { x, y } = layer.getFreeDragPosition();
      this.exportCtx.drawImage(layer.data.img, x / this.scale, y / this.scale);
    });
  }

  export() {
    const link = document.createElement('a');
    link.download = 'battlemap.png';
    link.href = this.exportCanvas.nativeElement.toDataURL();
    link.click();
    link.remove();
  }
}
