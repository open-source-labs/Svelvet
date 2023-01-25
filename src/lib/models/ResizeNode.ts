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

export class ResizeNode implements ResizeNodeType {
  constructor(
    public id: string,
    public canvasId: string,
    public nodeId: string,
    public positionX: number,
    public positionY: number
  ) {}

  setPosition(movementX: number, movementY: number, id: string) {
    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;

    //update all the anchors on the node in the anchorsStore
    const { resizeNodesStore, nodesStore } = stores[this.canvasId];

    console.log(this.positionX, 'POSITION IN CLASS');
    console.log(resizeNodesStore, 'NODE STORE');
  }
}
