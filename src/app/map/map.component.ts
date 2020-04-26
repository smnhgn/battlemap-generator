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
import { CdkDragEnd, CdkDrag } from '@angular/cdk/drag-drop';
import { Layer } from '../../models/layer.model';
import { LayerService } from '../../services/layer.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input() layerList: Layer[];
  @ViewChildren('canvas', { read: CdkDrag })
  canvasList: QueryList<CdkDrag>;
  @ViewChild('exportCanvas', { static: true })
  exportCanvas: ElementRef<HTMLCanvasElement>;
  exportCtx: CanvasRenderingContext2D;
  canvasChange = new Subject();

  constructor(private layerService: LayerService) {}

  ngOnInit(): void {
    this.exportCtx = this.exportCanvas.nativeElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.canvasList) {
      setTimeout(() => this.update(), 0);
    }
  }

  private getExportCanvasSize(): { width: number; height: number } {
    return this.canvasList.reduce(
      (size, canvas) => {
        let { x, y } = canvas.getFreeDragPosition();
        let { width, height } = canvas.data.img;
        const scale = canvas.data.scale;
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
  }

  dragEnd(event: CdkDragEnd) {
    this.update();
  }

  update() {
    this.canvasList.forEach((canvas) => {
      const canvasElement = canvas.element.nativeElement as HTMLCanvasElement;
      const ctx = canvasElement.getContext('2d');
      const { width, height } = canvasElement;
      const { img, scale } = canvas.data;
      ctx.clearRect(0, 0, width, height);
      canvasElement.width = img.width * scale;
      canvasElement.height = img.height * scale;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
    });
  }

  export() {
    let { width, height } = this.getExportCanvasSize();
    this.exportCanvas.nativeElement.width = width;
    this.exportCanvas.nativeElement.height = height;
    ({ width, height } = this.exportCanvas.nativeElement);
    this.exportCtx.clearRect(0, 0, width, height);

    this.canvasList.forEach((canvas) => {
      const canvasElement = canvas.element.nativeElement as HTMLCanvasElement;
      const { x, y } = canvas.getFreeDragPosition();
      this.exportCtx.drawImage(canvasElement, x, y);
    });

    const link = document.createElement('a');
    link.download = 'battlemap.png';
    link.href = this.exportCanvas.nativeElement.toDataURL();
    link.click();
    link.remove();
  }
}
