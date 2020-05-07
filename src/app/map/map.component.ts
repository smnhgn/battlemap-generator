import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChildren,
  QueryList,
  HostListener,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { Layer } from '../../models/layer.model';
import { Subject, merge } from 'rxjs';
import { debounceTime, takeUntil, shareReplay } from 'rxjs/operators';
import { MapItemComponent } from '../map-item/map-item.component';
import { Bounds } from '../../models/bounds.model';
import { NgxMoveableComponent } from 'ngx-moveable';
import Ruler from '@scena/ruler';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  private destroy$ = new Subject();
  @Input() layerList: Layer[];

  @ViewChild('container')
  container: ElementRef<HTMLDivElement>;
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  @ViewChildren('mapItem', { read: MapItemComponent })
  mapItems: QueryList<MapItemComponent>;
  mapItemsGroup: HTMLCanvasElement[];

  private mapChangeSubject = new Subject();
  mapChange$ = this.mapChangeSubject
    .asObservable()
    .pipe(debounceTime(100), shareReplay(1));

  bounds: Bounds;

  @ViewChild('rulerHorz')
  rulerHorzRef: ElementRef<HTMLDivElement>;
  rulerHorz: Ruler;
  @ViewChild('rulerVert')
  rulerVertRef: ElementRef<HTMLDivElement>;
  rulerVert: Ruler;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.rulerHorz.resize();
    this.rulerVert.resize();
  }
  @ViewChild('panzoomContainer')
  panzoomContainer: ElementRef<HTMLDivElement>;
  panzoom: PanzoomObject;

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (!event.shiftKey) return;
    this.panzoom.zoomWithWheel(event);
  }
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.shiftKey && this.panzoom.getOptions().disablePan) {
      this.panzoom.setOptions({
        disableZoom: false,
        disablePan: false,
        cursor: 'move',
      });
    }
  }
  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    if (!this.panzoom.getOptions().disablePan) {
      this.panzoom.setOptions({
        disableZoom: true,
        disablePan: true,
        cursor: 'default',
      });
    }
  }
  // get groupList(): Layer[] {
  //   return this.layerList.filter((layer) => layer.editable);
  // }

  // get isGroup() {
  //   return this.groupList.length > 1;
  // }
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.layerList.currentValue) {
      this.layerList = [...changes.layerList.currentValue].reverse();
    }
  }

  ngAfterViewInit(): void {
    this.initRuler();
    this.initPanzoom();

    this.context = this.canvas.nativeElement.getContext('2d');
    const { offsetWidth, offsetHeight } = this.panzoomContainer.nativeElement;
    this.bounds = { top: 0, right: offsetWidth, bottom: offsetHeight, left: 0 };

    merge(this.mapChange$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // set canvas size
        const { width, height } = this.getCanvasSize(this.mapItems.toArray());
        this.canvas.nativeElement.width = width;
        this.canvas.nativeElement.height = height;
        // set bounds
        // const bounds = { top: 0, right: width, bottom: height, left: 0 };
        // if (this.shouldBoundsUpdate(this.bounds, bounds)) {
        //   this.bounds = bounds;
        // }

        // clear canvas
        this.context.clearRect(0, 0, width, height);
        // update canvas
        this.drawImages(this.mapItems.toArray());

        // add group targets
        this.mapItemsGroup = this.mapItems
          .filter((item) => item.layer.editable)
          .map((item) => item.canvas.nativeElement);
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initRuler() {
    this.rulerHorz = new Ruler(this.rulerHorzRef.nativeElement, {
      type: 'horizontal',
      direction: 'start',
      height: 40,
      unit: 200,
      zoom: 1,
    });
    this.rulerVert = new Ruler(this.rulerVertRef.nativeElement, {
      type: 'vertical',
      direction: 'start',
      width: 40,
      unit: 200,
      zoom: 1,
    });
  }

  initPanzoom() {
    this.panzoom = Panzoom(this.panzoomContainer.nativeElement, {
      maxScale: 2,
      disableZoom: true,
      disablePan: true,
      cursor: 'default',
    });
    this.panzoomContainer.nativeElement.addEventListener(
      'panzoomchange',
      (event: CustomEvent) => {
        const { x, y, scale } = event.detail;
        const scrollY = -y;
        const scrollX = -x;
        (this.rulerVert as any).zoom = scale;
        (this.rulerHorz as any).zoom = scale;
        const { offsetWidth, offsetHeight } = event.target as HTMLElement;
        const diffX = (offsetWidth - offsetWidth * scale) / 2 / scale;
        const diffY = (offsetHeight - offsetHeight * scale) / 2 / scale;
        this.rulerHorz.scroll(scrollX - diffX);
        this.rulerVert.scroll(scrollY - diffY);
      }
    );
  }

  panzoomReset() {
    this.panzoom.reset();
  }

  mapItemChange(event: {
    layer: Layer;
    canvas: HTMLCanvasElement;
    moveable: NgxMoveableComponent;
  }) {
    this.mapChangeSubject.next();
  }

  private getCanvasSize(
    mapItems: MapItemComponent[]
  ): { width: number; height: number } {
    const sizes = mapItems.map((mapItem) => {
      const { width, height, x, y } = mapItem.layer;
      return { width, height, x, y };
    });
    const maxWidth = Math.max(0, ...sizes.map((size) => size.width + size.x));
    const maxHeight = Math.max(0, ...sizes.map((size) => size.height + size.y));
    return { width: maxWidth, height: maxHeight };
  }

  private drawImages(mapItems: MapItemComponent[]) {
    mapItems.forEach((mapItem) => {
      const { layer } = mapItem;
      const { width, height, x, y, rotate } = layer;
      const { width: imgWidth, height: imgHeight } = layer.img;
      const offsetX = (imgWidth - width) / 2;
      const offsetY = (imgHeight - height) / 2;

      this.context.save();
      // move to the position where layer should be drawn
      this.context.translate(x + offsetX, y + offsetY);
      // move to the center of the layer
      this.context.translate(width / 2, height / 2);
      // // rotate the canvas to the specified degrees
      this.context.rotate((rotate * Math.PI) / 180);

      this.context.drawImage(
        layer.img,
        0,
        0,
        imgWidth,
        imgHeight,
        -(width / 2),
        -(height / 2),
        width,
        height
      );
      this.context.restore();
    });
  }

  // private shouldBoundsUpdate(oldBounds: Bounds, newBounds: Bounds) {
  //   const shouldUpdate =
  //     !oldBounds ||
  //     newBounds.top !== oldBounds.top ||
  //     newBounds.right !== oldBounds.right ||
  //     newBounds.bottom !== oldBounds.bottom ||
  //     newBounds.left !== oldBounds.left;
  //   return shouldUpdate;
  // }

  // private getBounds(bbox: DOMRect): Bounds {
  //   let { top, right, bottom, left } = bbox;
  //   const padding = 0;
  //   return {
  //     top: top - padding,
  //     right: right + padding,
  //     bottom: bottom + padding,
  //     left: left - padding,
  //   };
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

  export() {
    const link = document.createElement('a');
    link.download = 'battlemap.png';
    link.href = this.canvas.nativeElement.toDataURL();
    link.click();
    link.remove();
  }

  // onRotateStart({ set, transform, target }, layer: Layer) {
  //   // scaleStart && scaleStart.set(layer.scale);
  //   console.log('onRotateStart', target!.style.transform);
  //   target!.style.transform = transform;
  //   // set(layer.scale);
  // }

  onRotateGroup({ targets, events }) {
    events.forEach(({ target, transform }, i) => {
      target!.style.transform = transform;
    });
  }

  onRotateGroupEnd({ targets }) {
    // this.moveableList.forEach((moveable) => {
    //   // moveable.updateRect();
    //   this.canvasChangeSubject.next();
    // });
  }

  onDragGroup({ targets, events }) {
    events.forEach(({ target, transform }, i) => {
      target!.style.transform = transform;
    });
  }

  onDragGroupEnd({ targets }) {
    // this.moveableList.forEach((moveable) => {
    //   // moveable.updateRect();
    //   this.canvasChangeSubject.next();
    // });
  }

  onScaleGroup({ targets, events }) {
    events.forEach(({ target, transform }, i) => {
      target!.style.transform = transform;
    });
  }

  onScaleGroupEnd({ targets }) {
    // this.moveableList.forEach((moveable) => {
    //   // moveable.updateRect();
    //   this.canvasChangeSubject.next();
    // });
  }
}
