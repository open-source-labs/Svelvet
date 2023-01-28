/**
 * This is where we create, update  the Anchor store.
 */
import type {
  NodeType,
  EdgeType,
  AnchorType,
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

/** Class representing an anchor with a Anchortype alias */
export class Anchor implements AnchorType {
  /**
   * creates an anchor.
   * @param {string} id - id that is created dynamically which will be set to a random string
   * @param {string} nodeId - id of the node in which this anchor will be set on
   * @param {string} edgeId - id of the edge that will connect the target and source anchors
   * @param {'source' | 'target'} sourceOrTarget - declaring if this anchor will be a source or target
   * @param {number} positionX - the 'X' coordinate of the anchor
   * @param {number} positionY - the 'Y' coordinate of the anchor
   * @param {function} callback - the callback function that will determine the position of this anchor from our anchprCb.ts file in our controllers
   * @param {string} canvasId - // not sure
   * @param { number } angle - this is the orientation of the anchor and is used to make sure bezier/step curves are rendered perpendicular to the node.
   *                           Angles are defined along the unit circle. EX: 0 = right side of node, 180 = left side of node.
   */
  constructor(
    public id: string,
    public nodeId: string,
    public edgeId: string,
    public sourceOrTarget: 'source' | 'target',
    public positionX: number,
    public positionY: number,
    public callback: Function,
    public canvasId: string,
    public angle: 0 | 90 | 180 | 270
  ) {}
  /**
   * @function setPositionFromNode -
   * @TODO - abstract this out so that people can define their own custom anchor positions
   */
  // Uses
  // When anchorCB runs, it will calculate the position of the anchor using the user-defined callback.
  // Then it will set the position of the anchor in the store
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

  updateEdges() {
    const { edgesStore } = stores[this.canvasId];
    /** update edges by deconstructing edges store and setting its new vlue to stores[this.canvasID] */

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
  delete() {
    console.log('anchor deletion not yet implemented');
  }
}
