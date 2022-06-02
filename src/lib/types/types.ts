import type { XYPosition } from './utils';

// interface for all nodes
export interface Node<T = any> {
  id: number;
  position: XYPosition;
  type: string;
  data: T;
  width?: number;
  height?: number;
  bgColor?: string;
  fontSize?: number;
}

// interface for basic edge
export interface Edges<T = any> {
  id: string;
  source: number;
  target: number;
  data?: T;
}

// handle type of either source or target
export type HandleType = 'source' | 'target';
