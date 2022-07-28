export interface ISelectedBox {
  id: number;
  box: any;
}

export interface IBoxesInfo {
  boxes: number[];
  isFocused: boolean;
  toggleEnable: boolean;
  boxContainer: any;
}