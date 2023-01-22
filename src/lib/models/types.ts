import type { Readable, Writable } from 'svelte/store';

// TODO: change to UserEdgeType
export interface UserNodeType {
  id: number | string;
  width: number;
  height: number;
  bgColor: string;
  data: object;
  position: { x: number; y: number };
}

// TODO: change to UserEdgeType
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
}

export interface NodeType {
  id: string;
  userLabel: string; // user-defined label
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  bgColor: string;
  data: string;
  setPosition: Function;
}

export interface EdgeType {
  id: string;
  type: string;
  targetId: string;
  sourceId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceAnchorId: string;
  targetAnchorId: string;
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
