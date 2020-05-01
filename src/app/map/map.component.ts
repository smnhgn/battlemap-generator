import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { Layer } from '../../models/layer.model';
import { Subject, merge } from 'rxjs';
import { debounceTime, takeUntil, shareReplay } from 'rxjs/operators';
import { LayerService } from '../../services/layer.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  private destroy$ = new Subject();
  @Input() layerList: Layer[];
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  private mapChangeSubject = new Subject();
  mapChange$ = this.mapChangeSubject
    .asObservable()
    .pipe(debounceTime(100), shareReplay(1));

  constructor(private layerService: LayerService) {}
  // get groupList(): Layer[] {
  //   return this.layerList.filter((layer) => layer.editable);
  // }

  // get isGroup() {
  //   return this.groupList.length > 1;
  // }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    merge(this.layerService.layerList$, this.mapChange$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // update export canvas
        console.log('update export canvas');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  mapItemChange() {
    this.mapChangeSubject.next();
  }

  // private getExportCanvasSize(): { width: number; height: number } {
  //   return this.canvasList.reduce(
  //     (size, canvasRef, index) => {
  //       const canvas = canvasRef.nativeElement;
  //       const layer = this.layerList[index];
  //       let { x, y } = layer;
  //       let { width, height } = layer.img;
  //       const [scaleX, scaleY] = layer.scale;
  //       width = width * scaleX + (width - width * scaleX) / 2;
  //       height = height * scaleY + (height - height * scaleY) / 2;
  //       if (width + x > size.width) {
  //         size.width = width + x;
  //       }
  //       if (height + y > size.height) {
  //         size.height = height + y;
  //       }
  //       return size;
  //     },
  //     { width: 0, height: 0 }
  //   );
  // }

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

  // updateExportCanvas() {
  //   let { width, height } = this.getExportCanvasSize();
  //   this.exportCanvas.nativeElement.width = width;
  //   this.exportCanvas.nativeElement.height = height;
  //   // console.log('updateExportCanvas', width, height);
  //   ({ width, height } = this.exportCanvas.nativeElement);
  //   this.exportCtx.clearRect(0, 0, width, height);

  //   this.canvasList.forEach((canvasRef, index) => {
  //     const canvas = canvasRef.nativeElement;
  //     const ctx = canvas.getContext('2d');
  //     const context = this.exportCtx;
  //     const layer = this.layerList[index];
  //     let { width, height } = layer.img;
  //     const [scaleX, scaleY] = layer.scale;
  //     // width = width * layer.scale[0];
  //     // height = height * layer.scale[1];
  //     let { x, y } = layer;
  //     // context.translate(width / 2, height / 2);
  //     // context.rotate((layer.rotate * Math.PI) / 180);
  //     // context.translate(-width / 2, -height / 2);
  //     // context.drawImage(
  //     //   ctx.canvas,
  //     //   x + (width - width * scaleX) / 2,
  //     //   y + (width - width * scaleX) / 2,
  //     //   scaleX * width,
  //     //   -scaleY * height
  //     // );
  //     // context.rotate(-(layer.rotate * Math.PI) / 180);

  //     context.save();
  //     // context.scale(scaleX, scaleY);
  //     context.translate(width / 2, height / 2);
  //     context.rotate((layer.rotate * Math.PI) / 180);
  //     context.translate(-width / 2, -height / 2);
  //     context.drawImage(canvas, x, y, scaleX * width, scaleY * height);
  //     context.restore();
  //   });
  // }

  // export() {
  //   const link = document.createElement('a');
  //   link.download = 'battlemap.png';
  //   link.href = this.exportCanvas.nativeElement.toDataURL();
  //   link.click();
  //   link.remove();
  // }

  // onRotateStart({ set, transform, target }, layer: Layer) {
  //   // scaleStart && scaleStart.set(layer.scale);
  //   console.log('onRotateStart', target!.style.transform);
  //   target!.style.transform = transform;
  //   // set(layer.scale);
  // }

  // onRotateGroup({ targets, events }) {
  //   events.forEach(({ target, transform }, i) => {
  //     target!.style.transform = transform;
  //   });
  // }

  // onRotateGroupEnd({ targets }) {
  //   // this.moveableList.forEach((moveable) => {
  //   //   // moveable.updateRect();
  //   //   this.canvasChangeSubject.next();
  //   // });
  // }

  // onDragGroup({ targets, events }) {
  //   events.forEach(({ target, transform }, i) => {
  //     target!.style.transform = transform;
  //   });
  // }

  // onDragGroupEnd({ targets }) {
  //   // this.moveableList.forEach((moveable) => {
  //   //   // moveable.updateRect();
  //   //   this.canvasChangeSubject.next();
  //   // });
  // }

  // onScaleGroup({ targets, events }) {
  //   events.forEach(({ target, transform }, i) => {
  //     target!.style.transform = transform;
  //   });
  // }

  // onScaleGroupEnd({ targets }) {
  //   // this.moveableList.forEach((moveable) => {
  //   //   // moveable.updateRect();
  //   //   this.canvasChangeSubject.next();
  //   // });
  // }
}
