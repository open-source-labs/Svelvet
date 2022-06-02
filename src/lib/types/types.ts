import type { Position } from 'postcss';
import type { XYPosition } from './utils';

// interface for all nodes
export interface Node<T = any> {
  id: number;
  position: XYPosition;
  data: T;
  width?: number;
  height?: number;
  bgColor?: string;
  fontSize?: number;
  borderColor?: string;
  textColor?: string;
}

export interface Edge<T = any> {
  id: string;
  source: number;
  target: number;
  label?: string;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;
}

// interface for basic edge
export interface DerivedEdge<T = any> {
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
}

export interface EdgeProps<T = any> {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

// handle type of either source or target
export type HandleType = 'source' | 'target';
