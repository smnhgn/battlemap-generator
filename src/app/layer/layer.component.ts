import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements AfterViewInit {
  @Input() file: File;
  @Input() width: number;
  @Input() height: number;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
      this.cd.detectChanges();
    };
    img.src = URL.createObjectURL(this.file);
  }
}
