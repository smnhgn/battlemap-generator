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
  @ViewChildren('canvasElement')
  canvasList: QueryList<ElementRef<HTMLCanvasElement>>;
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

  update() {
    this.canvasList.forEach((canvasRef, index) => {
      const canvas = canvasRef.nativeElement;
      const layer = this.layerList[index];
      console.log(canvas, layer);
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(layer.img, 0, 0);
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.canvasList) {
  //     setTimeout(() => this.update(), 0);
  //   }
  // }

  private getExportCanvasSize(): { width: number; height: number } {
    return this.canvasList.reduce(
      (size, canvasRef, index) => {
        const canvas = canvasRef.nativeElement;
        const layer = this.layerList[index];
        let { x, y } = layer;
        let { width, height } = layer.img;
        const [scaleX, scaleY] = layer.scale;
        width = width * scaleX + (width - width * scaleX) / 2;
        height = height * scaleY + (height - height * scaleY) / 2;
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

  // dragEnd(event: CdkDragEnd) {
  //   this.update();
  // }

  // update() {
  //   this.canvasList.forEach((canvas) => {
  //     const canvasElement = canvas.element.nativeElement as HTMLCanvasElement;
  //     const ctx = canvasElement.getContext('2d');
  //     const { width, height } = canvasElement;
  //     const { img, scale } = canvas.data;
  //     ctx.clearRect(0, 0, width, height);
  //     canvasElement.width = img.width * scale;
  //     canvasElement.height = img.height * scale;
  //     ctx.scale(scale, scale);
  //     ctx.drawImage(img, 0, 0);
  //   });
  // }

  updateExportCanvas() {
    let { width, height } = this.getExportCanvasSize();
    this.exportCanvas.nativeElement.width = width;
    this.exportCanvas.nativeElement.height = height;
    ({ width, height } = this.exportCanvas.nativeElement);
    this.exportCtx.clearRect(0, 0, width, height);

    this.canvasList.forEach((canvasRef, index) => {
      const canvas = canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      const context = this.exportCtx;
      const layer = this.layerList[index];
      let { width, height } = layer.img;
      const [scaleX, scaleY] = layer.scale;
      // width = width * layer.scale[0];
      // height = height * layer.scale[1];
      let { x, y } = layer;
      context.translate(width / 2, height / 2);
      context.rotate((layer.rotate * Math.PI) / 180);
      context.translate(-width / 2, -height / 2);
      context.drawImage(
        ctx.canvas,
        x + (width - width * scaleX) / 2,
        y + (width - width * scaleX) / 2,
        scaleX * width,
        -scaleY * height
      );
      context.rotate(-(layer.rotate * Math.PI) / 180);

      // context.save();
      // // context.scale(scaleX, scaleY);
      // context.translate(width / 2, height / 2);
      // context.rotate((layer.rotate * Math.PI) / 180);
      // context.translate(-width / 2, -height / 2);
      // context.drawImage(canvas, x, y, scaleX * width, scaleY * height);
      // context.restore();
    });
  }

  export() {
    const link = document.createElement('a');
    link.download = 'battlemap.png';
    link.href = this.exportCanvas.nativeElement.toDataURL();
    link.click();
    link.remove();
  }

  // onRotateStart({ set, transform, target }, layer: Layer) {
  //   // scaleStart && scaleStart.set(layer.scale);
  //   console.log('onRotateStart', target!.style.transform);
  //   target!.style.transform = transform;
  //   // set(layer.scale);
  // }
  onRotate({ transform, target, delta }, layer: Layer) {
    console.log(layer);
    layer.rotate += delta;
    target!.style.transform = transform;
    this.updateExportCanvas();
  }

  onDrag({ transform, target, left, top }, layer: Layer) {
    console.log(layer);
    layer.x = left;
    layer.y = top;
    target.style.left = left + 'px';
    target.style.top = top + 'px';
    // target!.style.transform = transform;
    this.updateExportCanvas();
  }

  onScale({ transform, target, delta }, layer: Layer) {
    console.log(layer);
    layer.scale[0] *= delta[0];
    layer.scale[1] *= delta[1];
    target!.style.transform = transform;
    this.updateExportCanvas();
  }
}
