import type { ResizeNodeType } from '../../store/types/types';
// import { writable, derived, get, readable } from 'svelte/store';
import { stores } from '../../store/models/store';

export class ResizeNode implements ResizeNodeType {
  constructor(
    public id: string,
    public canvasId: string,
    public nodeId: string,
    public positionX: number,
    public positionY: number
  ) {}

  //Sets position without updating the Node Store, this will be called when the Node is moved so that the anchor follows.
  setPosition(movementX: number, movementY: number) {
    this.positionX += movementX;
    this.positionY += movementY;
  }

  setPositionAndCascade(movementX: number, movementY: number) {
    //declare variables needed to interact with the corresponding node to this resize anchor
    const nodeId = this.nodeId;
    const { nodesStore } = stores[this.canvasId];

    //Updates the width/height of the corresponding Node
    nodesStore.update((nodes) => {
      const node = nodes[nodeId];

      //sets condition so node cannot be less than 20 px in width or height.
      if (node.width + movementX > 20 && node.height + movementY > 20) {
        //Updates position to this resizeNode anchor. Must be done within the update method so ensure the position doesn't change if the width goes below 20px
        this.positionX += movementX;
        this.positionY += movementY;
        //setSizeFromMovement will then update the anchors position as the width & height changes
        node.setSizeFromMovement(movementX, movementY);
      }
      return { ...nodes };
    });
  }

  delete() {
    const store = stores[this.canvasId];
    const { resizeNodesStore } = stores[this.canvasId];
    resizeNodesStore.update((resizeNodes) => {
      for (const resizeNodeId in resizeNodes) {
        if (resizeNodes[resizeNodeId].id === this.id) {
          delete resizeNodes[resizeNodeId];
        }
      }
      return { ...resizeNodes };
    });
  }
}
