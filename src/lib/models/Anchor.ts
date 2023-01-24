import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
} from './types';
import { writable, derived, get, readable } from 'svelte/store';
import { getNodes, getAnchors, findStore } from '../controllers/storeApi';
import { stores } from './store';

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

  updateEdges() {
    const { edgesStore } = stores[this.canvasId];
    // update edges

    edgesStore.update((edges) => {
      const edge = edges[this.edgeId];
      // this means that no edge was found, just return without doing anything

      if (edge === undefined) {
        console.log(`edge ${this.edgeId} not found`);
        return { ...edges };
      }
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

  setPosition(x: number, y: number) {
    this.positionX = x;
    this.positionY = y;
    this.updateEdges();
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
