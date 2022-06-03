import type { Position } from 'postcss';
import type { XYPosition } from './utils';

export interface Node<T = any> {
  id: number;
  position: XYPosition;
  data: T;
  width?: number;
  height?: number;
  bgColor?: string;
  fontSize?: number;
  borderColor?: string;
  borderRadius?: number;
  textColor?: string;
}

export interface Edge {
  id: string;
  source: number;
  target: number;
  label?: string;
  type?: string;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;
}

export interface DerivedEdge extends Edge {
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
}

export interface EdgeProps extends DerivedEdge {
  path: string;
}

export interface EdgeTextProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label?: any;
}

export type HandleType = 'source' | 'target';
