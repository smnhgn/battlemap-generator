import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  Input,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements AfterViewInit {
  @Input() file: File;
  width: number;
  height: number;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    const fr = new FileReader();
    fr.onload = () => {
      // file is loaded
      const img = new Image();
      img.onload = () => {
        // image is loaded; sizes are available
        const scale = 0.25;
        this.canvas.nativeElement.width = img.width * scale;
        this.canvas.nativeElement.height = img.height * scale;
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(img, 0, 0);
      };
      img.src = fr.result as string; // is the data URL because called with readAsDataURL
    };
    fr.readAsDataURL(this.file);
  }
}
