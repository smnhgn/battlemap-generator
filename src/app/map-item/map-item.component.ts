import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import { Layer } from '../../models/layer.model';
import { NgxMoveableComponent } from 'ngx-moveable';

@Component({
  selector: 'app-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapItemComponent implements AfterViewInit {
  @Input() layer: Layer;
  @Input() editable: boolean;
  @Input() index: number;
  @Input() bounds: any;
  @Input() container: any;

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  @ViewChild('moveable', { read: NgxMoveableComponent })
  moveable: NgxMoveableComponent;
  @Output() change = new EventEmitter<{
    layer: Layer;
    canvas: HTMLCanvasElement;
    moveable: NgxMoveableComponent;
  }>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // trigger change
    if (this.canvas) {
      this.onChange(this.layer);
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');
    const { width, height } = canvas;
    this.context.clearRect(0, 0, width, height);
    this.context.drawImage(this.layer.img, 0, 0);
    // trigger change
    this.onChange(this.layer);
  }

  onRotate({ transform, target, delta }, layer: Layer) {
    layer.rotate += delta;
    target!.style.transform = transform;
    // trigger change
    this.onChange(layer);
  }

  onDrag({ transform, target, left, top }, layer: Layer) {
    layer.x = left;
    layer.y = top;
    target.style.left = left + 'px';
    target.style.top = top + 'px';
    // target!.style.transform = transform;
    // trigger change
    this.onChange(layer);
  }

  onScale({ transform, target, delta }, layer: Layer) {
    layer.scale[0] *= delta[0];
    layer.scale[1] *= delta[1];
    layer.width = layer.img.width * layer.scale[0];
    layer.height = layer.img.height * layer.scale[1];
    target!.style.transform = transform;
    // trigger change
    this.onChange(layer);
  }

  onChange(layer: Layer) {
    this.change.emit({
      layer,
      canvas: this.canvas.nativeElement,
      moveable: this.moveable,
    });
    this.moveable?.updateRect();
  }
}
