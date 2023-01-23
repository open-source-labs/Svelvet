import type { Readable, Writable } from 'svelte/store';

export interface UserNodeType {
  id: string;
  width: number;
  height: number;
  bgColor: string;
  data: object;
  position: { x: number; y: number };
  borderColor: string;
  image: boolean;
  src: string;
  textColor: string;
  targetPosition: 'left' | 'right' | 'top' | 'bottom';
  sourcePosition: 'left' | 'right' | 'top' | 'bottom';
  borderRadius: number;
}

export interface UserEdgeType {
  id: string;
  source: string;
  target: string;
  label?: string;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
  type?: string;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;
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
  nodeSelected: Writable<boolean>; // this is used to stop d3 panning when node is being dragged
  d3Scale: Writable<number>; // for zoom and pan
}

export interface NodeType {
  id: string;
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
  borderRadius: number;
  canvasId: string;
}

export interface EdgeType {
  id: string;
  sourceId: string; // id of node that is the "source" of the edge : TODO: can we remove this? this is redundant to sourceAnchorId
  targetId: string; // id of node that is the "target" of the edge : TODO: can we remove this? this is redundant to targetAnchorId
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceAnchorId: string; // id of the anchor that is the "source" of the edge
  targetAnchorId: string; // id of the anchor that is the "target" of the edge
  canvasId: string;
  label?: string;
  type?: string;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;
}

export interface AnchorType {
  id: string; // note that the user never specifies an anchor and they are generated dynamically. id will be a random string.
  nodeId: string;
  edgeId: string;
  sourceOrTarget: 'source' | 'target';
  positionX: number;
  positionY: number;
  callback: Function;
  setPosition: Function;
}
