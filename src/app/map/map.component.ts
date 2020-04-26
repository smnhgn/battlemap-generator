import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  Input,
  SimpleChanges,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { CdkDragEnd, CdkDrag } from '@angular/cdk/drag-drop';
import { Layer } from '../../models/layer.model';
import { DropService } from '../../services/drop.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input() layerList: Layer[];
  @ViewChildren('layerComponent', { read: CdkDrag })
  layer: QueryList<CdkDrag>;
  @ViewChild('exportCanvas', { static: true })
  exportCanvas: ElementRef<HTMLCanvasElement>;
  exportCtx: CanvasRenderingContext2D;

  constructor(private drop: DropService) {}

  ngOnInit(): void {
    this.exportCtx = this.exportCanvas.nativeElement.getContext('2d');
    this.drop.layerChange$.subscribe(() => this.update());
  }

  dragEnd(event: CdkDragEnd) {
    this.update();
  }

  update() {
    const { width, height } = this.layer.reduce(
      (size, layer) => {
        let { x, y } = layer.getFreeDragPosition();
        let { width, height } = layer.data.img;
        const scale = layer.data.scale;
        width = width * scale;
        height = height * scale;
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
      this.exportCtx.drawImage(layer.data.canvas.nativeElement, x, y);
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
