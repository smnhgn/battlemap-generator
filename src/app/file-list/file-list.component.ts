import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DropService } from '../../services/drop.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  fileList$: Observable<File[]>;

  constructor(private drop: DropService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fileList$ = this.drop.fileList$;
  }
}
