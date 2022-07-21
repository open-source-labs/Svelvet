//import type { Position } from 'postcss';
import type { XYPosition, Position } from './utils';
// TODO Add limitations to sourcePosition and targetPosition
export interface Node<T = any> {
  id: number;
  position: XYPosition;
  data: T;
  width: number;
  height: number;
  bgColor?: string;
  fontSize?: number;
  borderColor?: string;
  borderRadius?: number;
  textColor?: string;
  clickCallback?: Function;
  image?: boolean;
  src?: string;
  sourcePosition?: 'left' | 'right' | 'top' | 'bottom';
  targetPosition?: 'left' | 'right' | 'top' | 'bottom';
}

export interface Edge {
  id: string;
  source: number;
  target: number;
  label?: string;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
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
  centerX: number;
  centerY: number;
}

export interface EdgeTextProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label?: any;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
  centerX: number;
  centerY: number;
}

export type HandleType = 'source' | 'target';
