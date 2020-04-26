import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, shareReplay } from 'rxjs/operators';
import { Layer, defaultLayer } from '../models/layer.model';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private layerListSubject = new BehaviorSubject<Layer[]>([]);
  layerList$ = this.layerListSubject
    .asObservable()
    .pipe(debounceTime(100), shareReplay(1));

  constructor() {}

  addLayer(file: File) {
    const layerList = this.layerListSubject.value;
    const layer = { ...defaultLayer, file };
    layerList.push(layer);
    this.updateList(layerList);
  }

  updateList(layerList: Layer[]) {
    this.layerListSubject.next(layerList);
  }
}
