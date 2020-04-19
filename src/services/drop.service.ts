import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  files: File[] = [];

  constructor() {}
}
