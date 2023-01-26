import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
} from './types';
import { writable, derived, get, readable } from 'svelte/store';
import {
  getNodes,
  getAnchors,
  findStore,
  getNodeById,
} from '../controllers/storeApi';
import { stores } from './store';

export class ResizeNode implements ResizeNodeType {
  constructor(
    public id: string,
    public canvasId: string,
    public nodeId: string,
    public positionX: number,
    public positionY: number
  ) {}

  setPosition(movementX: number, movementY: number) {
    this.positionX += movementX;
    this.positionY += movementY;
  }

  setPositionAndCascade(movementX: number, movementY: number, id: string) {
    // calculate new anchor position
    // claculate new node width/height
    // if width<0 or height<0 return

    // this.positionX = X
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;
    const nodeId = this.nodeId;
    // console.log('NODEID: ', nodeId);

    //update all the anchors on the node in the anchorsStore
    const { resizeNodesStore, nodesStore } = stores[this.canvasId];

    // const store = stores[this.canvasId];
    // const node = getNodeById(store, nodeId);
    nodesStore.update((nodes) => {
      const node = nodes[nodeId];
      node.setSizeFromMovement(movementX, movementY);
      return { ...nodes };
    });
  }
}
