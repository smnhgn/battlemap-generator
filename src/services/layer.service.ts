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

  async addLayer(name: string, path: string) {
    const layerList = this.layerListSubject.value;

    const layer = {
      ...defaultLayer,
      name,
      img: await loadImage(path),
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
