import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { DropService } from 'src/services/drop.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  fileList: File[];

  constructor(private drop: DropService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.drop.fileList$.subscribe((fileList) => {
      this.fileList = fileList;
      this.cd.detectChanges();
    });
  }
}
