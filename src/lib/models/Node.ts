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
