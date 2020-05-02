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
