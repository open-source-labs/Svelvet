/**
 * This is where we create, update  the Anchor store.
 */

import type { AnchorCbType, AnchorType } from '$lib/edges/types/types';

import type {
  NodeType,
  EdgeType,
  StoreType,
  ResizeNodeType,
} from '../../store/types/types';
import { writable, derived, get, readable } from 'svelte/store';
import {
  getNodes,
  getAnchors,
  findStore,
} from '../../store/controllers/storeApi';
import { stores } from '../../store/models/store';

/** Class representing an anchor with a Anchortype alias
* creates an anchor.
* @param {string} id The id of the Anchor
* @param {string} nodeId The id of the Node which the instantiated Anchor will be attached to
* @param {string} edgeId The id of the Edge which connects to the instantiated Anchor
* @param {'source' | 'target'} sourceOrTarget Specify the Anchor is a source or target 
* @param {number} positionX The 'X' coordinate of the Anchor
* @param {number} positionY The 'Y' coordinate of the Anchor
* @param {function} callback The callback function that will determine the position of this Anchor
* @param {string} canvasId The canvasId of the Svelvet component that will hold this Anchor
* @param { number } angle This is the orientation of the anchor and is used to make sure bezier/step curves are rendered perpendicular to the node. Angles are defined along the unit circle. EX: 0 = right side of node, 180 = left side of node.
*/
export class Anchor implements AnchorType {

  constructor(
    public id: string,
    public nodeId: string,
    public edgeId: string,
    public sourceOrTarget: 'source' | 'target',
    public positionX: number,
    public positionY: number,
    public callback: AnchorCbType,
    public canvasId: string,
    public angle: 0 | 90 | 180 | 270
  ) {}
  /**
   * setPositionFromNode will invoke the user-defined callback to calculate the position of the Anchor, set the position of the Anchor in the anchorsStore, and also update the Edge position accordingly.
  */
  setPositionFromNode() {
    /**get node data */
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
  /**
   * updateEdges will update the edgesStore based on Anchor's change.
   */
  updateEdges() {
    const { edgesStore } = stores[this.canvasId];
    /** update edges by deconstructing edges store and setting its new vlue to stores[this.canvasID] */

    edgesStore.update((edges) => {
      const edge = edges[this.edgeId];
      // this means that no edge was found, just return without doing anything

      if (edge === undefined) {
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
  
  /**
   * setPosition will update the positionX and positionY of the Anchor and also cascade changes to related Edge.
   * @param x The X coordinate of the new position for the Anchor
   * @param y The Y coordinate of the new position for the Anchor
   */
  setPosition(x: number, y: number) {
    this.positionX = x;
    this.positionY = y;
    this.updateEdges();
  }

  /**
   * Anchor.setPositionFromMovement works similarly to Anchor.setPosition. But setPosition is more powerful and we recommend using setPosition whenever possible and in the future, setPositionFromMovement can be removed.
   * @param movementX The mouse movement value on the X-axis
   * @param movementY The mouse movement value on the Y-axis
   */
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

}
