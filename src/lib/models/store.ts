import { writable, derived, get, readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { NodeType, EdgeType, AnchorType, StoreType } from './types';

/*
  `store` is a dictionary of Svelvet stores.
    * The reason why we have multiple Svelvet stores is to handle multiple canvases on the same page.
    * A Svelvet store is the single source of truth for a canvas state.
    * We discourage developers from interacting with stores directly; instead use the api methods in 
      `$lib/controllers/storeApi.ts`. However, if need to direct access you can do so by importing:
      `import { store } from '$lib/models/store';`
    *
*/
export const stores: { [key: string]: StoreType } = {};

export class Edge {
  id: string;
  canvasId: string;
  sourceAnchorId: string;
  targetAnchorId: string;
  sourceId: string;
  targetId: string;
  type?: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label: string;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;

  constructor({
    id,
    sourceId,
    targetId,
    type,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceAnchorId,
    targetAnchorId,
    canvasId,
    label,
    labelBgColor,
    labelTextColor,
    edgeColor,
    animate,
    noHandle,
    arrow,
  }: {
    id: string;
    sourceId: string;
    targetId: string;
    type?: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourceAnchorId: string;
    targetAnchorId: string;
    canvasId: string;
    label: string;
    labelBgColor?: string;
    labelTextColor?: string;
    edgeColor?: string;
    animate?: boolean;
    noHandle?: boolean;
    arrow?: boolean;
  }) {
    this.id = id;
    //surce is the id of the source node
    this.sourceId = sourceId;
    //target is the id of the target node
    this.targetId = targetId;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.type = type;
    this.sourceAnchorId = sourceAnchorId;
    this.targetAnchorId = targetAnchorId;
    this.canvasId = canvasId;
    this.label = label;
    this.labelBgColor = labelBgColor;
    this.labelTextColor = labelTextColor;
    this.edgeColor = edgeColor;
    this.animate = animate;
    this.noHandle = noHandle;
    this.arrow = arrow;
  }

  // TODO: implement me
  handleDelete() {
    console.log('deleting edge not implemented yet');
  }
}

export class Anchor implements AnchorType {
  id: string;
  nodeId: string;
  edgeId: string;
  sourceOrTarget: 'source' | 'target';
  positionX: number;
  positionY: number;
  callback: Function;
  canvasId: string;

  constructor(
    id: string,
    nodeId: string,
    edgeId: string,
    sourceOrTarget: 'source' | 'target',
    positionX: number,
    positionY: number,
    callback: Function,
    canvasId: string
  ) {
    this.id = id;
    this.nodeId = nodeId;
    this.edgeId = edgeId;
    this.sourceOrTarget = sourceOrTarget;
    this.positionX = positionX;
    this.positionY = positionY;
    this.callback = callback;
    this.canvasId = canvasId;
  }

  setPosition(movementX: number, movementY: number) {
    this.positionX += movementX;
    this.positionY += movementY;

    const { edgesStore } = stores[this.canvasId];

    edgesStore.update((edges) => {
      for (const key in edges) {
        if (edges[key].sourceAnchorId === this.id) {
          edges[key].sourceX += movementX;
          edges[key].sourceY += movementY;
        }
        if (edges[key].targetAnchorId === this.id) {
          edges[key].targetX += movementX;
          edges[key].targetY += movementY;
        }
      }
      return { ...edges };
    });
  }

  // TODO: implement me
  handleDelete() {
    console.log('anchor deletion not yet implemented');
  }
}

export class Node implements NodeType {
  constructor(
    public id: string,
    public positionX: number,
    public positionY: number,
    public width: number,
    public height: number,
    public bgColor: string,
    public data: string,
    public canvasId: string,
    public borderColor: string,
    public image: boolean,
    public src: string,
    public textColor: string,
    public targetPosition: 'left ' | 'right' | 'top' | 'bottom',
    public sourcePosition: 'left ' | 'right' | 'top' | 'bottom',
    public borderRadius: number
  ) {}

  setPosition(movementX: number, movementY: number) {
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;

    //update all the anchors on the node in the anchorsStore
    const { anchorsStore } = stores[this.canvasId];

    anchorsStore.update((anchors) => {
      for (const key in anchors) {
        if (anchors[key].nodeId === this.id) {
          // console.log('trying to update the anchorsStore')
          anchors[key].setPosition(movementX, movementY);
        }
      }
      return { ...anchors };
    });
  }

  // TODO: implement me
  handleDelete() {
    console.log('node deletion not yet implemented');
  }
}
