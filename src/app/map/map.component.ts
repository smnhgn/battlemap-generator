import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { DropService } from 'src/services/drop.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit {
  width = 2550;
  height = 3300;
  fileList: File[] = [];

  constructor(private drop: DropService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.drop.fileList$.subscribe((fileList) => {
      this.fileList = fileList;
      this.cd.detectChanges();
    });
  }
}
