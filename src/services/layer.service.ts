import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, shareReplay } from 'rxjs/operators';
import { Layer } from '../models/layer.model';
import { loadImage } from '../utils/file.utils';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  private layerListSubject = new BehaviorSubject<Layer[]>([]);
  layerList$ = this.layerListSubject
    .asObservable()
    .pipe(debounceTime(100), shareReplay(1));
  // private layerChangeSubject = new Subject();
  // layerChange$ = this.layerChangeSubject.asObservable().pipe(debounceTime(100));

  async addLayer(name: string, path: string) {
    const layerList = this.layerListSubject.value;
    const img = await loadImage(path);
    const layer = {
      name,
      img,
      width: img.width,
      height: img.height,
      x: 0,
      y: 0,
      scale: [1, 1],
      rotate: 0,
      editable: true,
    };
    layerList.unshift(layer);
    this.updateList(layerList);
  }

  async duplicateLayer(layer: Layer) {
    layer = { ...layer };
    const layerList = this.layerListSubject.value;
    layerList.unshift(layer);
    this.updateList(layerList);
  }

  updateList(layerList: Layer[]) {
    this.layerListSubject.next(layerList);
  }

  deleteLayers() {
    const layerList = this.layerListSubject.value;
    this.updateList(layerList.filter((layer) => !layer.editable));
  }
  // layerChange() {
  //   this.layerChangeSubject.next();
  // }
}
