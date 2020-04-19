import { Component, OnInit } from '@angular/core';
import { DropService } from 'src/services/drop.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent implements OnInit {
  active = false;

  constructor(private drop: DropService) {}

  ngOnInit(): void {}

  fileDropped(event) {
    this.drop.files.push(event);
  }
}
