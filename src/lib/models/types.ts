import type { Readable, Writable } from 'svelte/store';

// TODO: change to UserEdgeType
export interface TypeUserNode {
  id: number | string;
  width: number;
  height: number;
  bgColor: string;
  data: object;
  position: { x: number; y: number };
}

// TODO: change to UserEdgeType
export interface TypeUserEdge {
  id: string;
  source: number | string;
  target: number | string;
  animate: boolean;
  label: string;
  type: string; // Possible values: 'step'
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
}

export interface EdgeType {
  id: string;
  type: string;
  targetId: number;
  sourceId: number;
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
  edgeId: string;
  sourceOrSink: string;
  positionX: number;
  positionY: number;
  callback: Function;
  setPosition: Function;
}