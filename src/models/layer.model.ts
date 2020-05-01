export interface Layer {
  name: string;
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number[];
  rotate: number;
  editable: boolean;
}

export const defaultLayer = {
  name: 'Layer',
  img: null,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scale: [1, 1],
  rotate: 0,
  editable: false,
};
