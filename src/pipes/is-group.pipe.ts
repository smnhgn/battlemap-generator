import { Pipe, PipeTransform } from '@angular/core';
import { Layer } from '../models/layer.model';

@Pipe({ name: 'isGroup' })
export class IsGroupPipe implements PipeTransform {
  transform(layerList: Layer[]): any {
    const isGroup = layerList?.filter((layer) => layer.editable).length > 1;
    return isGroup;
  }
}
