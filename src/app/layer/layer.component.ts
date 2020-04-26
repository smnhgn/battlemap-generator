import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LayerService } from '../../services/layer.service';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements OnInit {
  @Input() img: HTMLImageElement;
  @Input() scale: number;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  constructor(private layerService: LayerService) {}

  async ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) {
      this.update();
    }
  }

  update() {
    const { width, height } = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, width, height);
    this.canvas.nativeElement.width = this.img.width * this.scale;
    this.canvas.nativeElement.height = this.img.height * this.scale;
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.img, 0, 0);
    this.layerService.layerChange();
  }
}
