// enumerable values (static) set for Position
export enum Position {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}

// interface for XYPosition to use in nodes and edges
export interface XYPosition {
  x: number;
  y: number;
}

// type for z axis positioning with D3
export type XYZPosition = XYPosition & { z: number };

// interface for changing dimensions of Viewport
export interface Dimensions {
  width: number;
  height: number;
}

// interface of Rect divs in zoompane
export interface Rect extends Dimensions, XYPosition {}

// interface of Box using XYPosition of nodes
export interface Box extends XYPosition {
  x2: number;
  y2: number;
}

// D3 type array for Transform
export type Transform = [number, number, number];

//
// export type CoordinateExtent = [[number, number], [number, number]];
