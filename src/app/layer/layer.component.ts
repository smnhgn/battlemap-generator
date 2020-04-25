import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  Input,
  AfterViewInit,
} from '@angular/core';
import { loadImage } from 'src/utils/file.utils';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements AfterViewInit {
  @Input() file: File;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  scale: number;
  img: HTMLImageElement;

  constructor() {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    this.scale = 0.25;
    this.img = await loadImage(URL.createObjectURL(this.file));
    this.canvas.nativeElement.width = this.img.width * this.scale;
    this.canvas.nativeElement.height = this.img.height * this.scale;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.img, 0.5, 0.5);
  }
}
