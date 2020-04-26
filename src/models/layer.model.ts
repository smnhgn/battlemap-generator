export interface Layer {
  name: string;
  img: HTMLImageElement;
  x: number;
  y: number;
  scale: number[];
  rotate: number;
}

export const defaultLayer = {
  name: 'Layer',
  img: null,
  x: 0,
  y: 0,
  scale: [1, 1],
  rotate: 0,
};
