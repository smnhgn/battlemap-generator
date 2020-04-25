import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DropService } from '../../services/drop.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  fileList$: Observable<File[]>;

  constructor(private drop: DropService) {}

  ngOnInit(): void {
    this.fileList$ = this.drop.fileList$;
  }
}
