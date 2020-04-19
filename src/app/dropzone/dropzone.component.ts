import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {
  active = false;

  constructor() { }

  ngOnInit(): void { }

  fileDropped(event) {
    console.log(event);
  }

}
