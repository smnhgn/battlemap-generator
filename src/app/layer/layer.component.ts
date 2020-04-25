import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  Input,
  OnInit,
} from '@angular/core';
import { loadImage } from 'src/utils/file.utils';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements OnInit {
  @Input() file: File;
  @Input() scale: number;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  img: HTMLImageElement;

  constructor() {}

  async ngOnInit() {
    this.img = await loadImage(URL.createObjectURL(this.file));
    this.canvas.nativeElement.width = this.img.width * this.scale;
    this.canvas.nativeElement.height = this.img.height * this.scale;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.img, 0, 0);
  }
}
