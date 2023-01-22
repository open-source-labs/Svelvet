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
