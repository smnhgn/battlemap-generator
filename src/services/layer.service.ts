import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, shareReplay } from 'rxjs/operators';
import { Layer, defaultLayer } from '../models/layer.model';
import { loadImage } from '../utils/file.utils';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  private layerListSubject = new BehaviorSubject<Layer[]>([]);
  layerList$ = this.layerListSubject
    .asObservable()
    .pipe(debounceTime(100), shareReplay(1));
  private layerChangeSubject = new Subject();
  layerChange$ = this.layerChangeSubject.asObservable().pipe(debounceTime(100));

  constructor() {}

  async addLayer(file: File) {
    const layerList = this.layerListSubject.value;

    const layer = {
      ...defaultLayer,
      name: file.name,
      img: await loadImage(URL.createObjectURL(file)),
    };
    layerList.push(layer);
    this.updateList(layerList);
  }

  updateList(layerList: Layer[]) {
    this.layerListSubject.next(layerList);
  }

  layerChange() {
    this.layerChangeSubject.next();
  }
}
