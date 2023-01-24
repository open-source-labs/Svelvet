import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
} from './types';
import { writable, derived, get, readable } from 'svelte/store';
import { getNodes, getAnchors, findStore } from '../controllers/storeApi';

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

export class ResizeNode implements ResizeNodeType {
  constructor(
    public id: string,
    public canvasId: string,
    public positionX: number,
    public positionY: number
  ) {}
}

export class Edge implements EdgeType {
  constructor(
    public id: string,
    public sourceX: number,
    public sourceY: number,
    public targetX: number,
    public targetY: number,
    public canvasId: string,
    public label?: string,
    public type?: string,
    public labelBgColor?: string,
    public labelTextColor?: string,
    public edgeColor?: string,
    public animate?: boolean,
    public noHandle?: boolean,
    public arrow?: boolean
  ) {}

  // TODO: implement me
  handleDelete() {
    console.log('deleting edge not implemented yet');
  }
}

export class Anchor implements AnchorType {
  constructor(
    public id: string,
    public nodeId: string,
    public edgeId: string,
    public sourceOrTarget: 'source' | 'target',
    public positionX: number,
    public positionY: number,
    public callback: Function, //
    public canvasId: string
  ) {}

  // Uses
  // When anchorCB runs, it will calculate the position of the anchor using the user-defined callback.
  // Then it will set the position of the anchor in the store
  // TODO: abstract this out so that people can define their own custom anchor positions
  setPositionFromNode() {
    // get node data
    const store = findStore(this.canvasId);
    const node = getNodes(store, { id: this.nodeId })[0]; // TODO add error checking for zero elements, this means that there is no node corresponding to this.nodeId
    const { positionX, positionY, width, height } = node;
    // calculate the new position of the anchor using user-defined callback
    this.callback();
    const { edgesStore } = stores[this.canvasId];
    // update edges
    edgesStore.update((edges) => {
      const edge = edges[this.edgeId];
      if (this.sourceOrTarget === 'source') {
        edge.sourceX = this.positionX;
        edge.sourceY = this.positionY;
      } else {
        edge.targetX = this.positionX;
        edge.targetY = this.positionY;
      }
      return { ...edges };
    });
  }

  setPositionFromMovement(movementX: number, movementY: number) {
    this.positionX += movementX;
    this.positionY += movementY;
    const { edgesStore } = stores[this.canvasId];

    edgesStore.update((edges) => {
      const edge = edges[this.edgeId];
      if (this.sourceOrTarget === 'source') {
        edge.sourceX += movementX;
        edge.sourceY += movementY;
      } else {
        edge.targetX += movementX;
        edge.targetY += movementY;
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
    public borderRadius: number
  ) {}

  setPosition(movementX: number, movementY: number) {
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;

    //update all the anchors on the node in the anchorsStore
    const { anchorsStore } = stores[this.canvasId];

    anchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchors[anchorId].nodeId === this.id) {
          anchors[anchorId].setPositionFromNode();
          //anchors[anchorId].setPosition(movementX, movementY);
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
