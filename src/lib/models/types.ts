import type { Readable, Writable } from 'svelte/store';

export interface UserNodeType {
  id: number | string;
  width: number;
  height: number;
  bgColor: string;
  data: object;
  position: { x: number; y: number };
  borderColor: string;
  image: boolean;
  src: string;
  textColor: string;
  targetPosition: 'left ' | 'right' | 'top' | 'bottom';
  sourcePosition: 'left ' | 'right' | 'top' | 'bottom';
  borderRadius: number;
}

export interface UserEdgeType {
  id: string;
  source: number | string;
  target: number | string;
  animate: boolean;
  label: string;
  type: string; // TODO: replace with explicit possible values such as 'step'
}

/*
Type for a single svelvet store
*/
export interface StoreType {
  nodesStore: Writable<{ [key: string]: NodeType }>;
  edgesStore: Writable<{ [key: string]: EdgeType }>;
  anchorsStore: Writable<{ [key: string]: AnchorType }>;
  widthStore: Writable<number>;
  heightStore: Writable<number>;
  backgroundStore: Writable<boolean>;
  movementStore: Writable<boolean>;
  nodeIdSelected: Writable<number>;
  nodeSelected: Writable<boolean>;
  d3Scale: Writable<number>;
}

export interface NodeType {
  id: string;
  userLabel: string; // user-defined label. This is id on the initial Node
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  bgColor: string;
  data: string; // This is a JSON string
  setPosition: Function;
  borderColor: string;
  image: boolean;
  src: string;
  textColor: string;
  targetPosition: 'left ' | 'right' | 'top' | 'bottom';
  sourcePosition: 'left ' | 'right' | 'top' | 'bottom';
  borderRadius: number;
  canvasId: string;
}

export interface EdgeType {
  id: string; // this is generated automatically, not the same as userLabel
  userLabel: string; // this is userEdge.id
  type: string;
  targetId: string;
  sourceId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceAnchorId: string;
  targetAnchorId: string;
  label: string;
}

export interface AnchorType {
  id: string;
  nodeId: string;
  edgeUserLabel: string;
  sourceOrTarget: 'source' | 'target';
  positionX: number;
  positionY: number;
  callback: Function;
  setPosition: Function;
}
