export interface Layer {
  name: string;
  img: HTMLImageElement;
  scale: number;
}

export const defaultLayer = {
  name: 'Layer',
  img: null,
  scale: 1,
};
