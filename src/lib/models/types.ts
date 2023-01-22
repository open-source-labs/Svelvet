import type { Readable, Writable } from 'svelte/store';

export interface TypeUserNode {
  id: number;
  width: number;
  height: number;
  bgColor: string;
  data: object;
  position: { x: number; y: number };
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
  userLabel: number; // user-defined label
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
