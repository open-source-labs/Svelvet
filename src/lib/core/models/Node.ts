/** this is where we create our node store */
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
} from '../types/types';
import { writable, derived, get, readable } from 'svelte/store';
import {
  getNodes,
  getAnchors,
  findStore,
  getAnchorFromEdge,
  getEdgeById,
  getResizeNodes,
  getPotentialAnchors,
} from '../controllers/storeApi';
import { stores } from './store';
import { populateNodesStore } from '$lib/controllers/util';

/** Class representing an anchor with a Anchortype alias */
export class Node implements NodeType {
  /**
   * @param {string} id - id of the node we created genertated by a random string //i think
   * @param {number} positionX - 'X' position of the node
   * @param {number} positionY - 'Y' position of the node
   * @param {number} width - width of the node
   * @param {number} height - height of the node
   * @param {string} bgColor - background color of node
   * @param {object} data - //note sure
   * @param {string} canvasId - //note sure
   * @param {string} borderColor - border color of node
   * @param {boolean} image - //not sure
   * @param {string} src - //not sure
   * @param {string} textColor - the color of the text in the node
   * @param {string} borderRadius - //not sure
   * @param {string} childNodes - this is for the GroupNodes feature
   * @param {string} className - this is for the custom className for Node
   */
  constructor(
    public id: string,
    public positionX: number,
    public positionY: number,
    public width: number,
    public height: number,
    public bgColor: string,
    public data: object,
    public canvasId: string,
    public borderColor: string,
    public image: boolean,
    public src: string,
    public textColor: string,
    public borderRadius: number,
    public childNodes: string[], // this is required for feature "node-grouping". Personally, I think this is feature bloat and should be removed
    public className?: string
  ) {}

  /**
   * @function setPosition -
   * @param {number} movementX -
   * @param {number} movementy -
   */
  setPositionFromMovement(movementX: number, movementY: number) {
    const {
      nodesStore,
      anchorsStore,
      resizeNodesStore,
      potentialAnchorsStore,
    } = stores[this.canvasId];

    //update all necessary data
    this.positionX += movementX;
    this.positionY += movementY;

    // update children
    nodesStore.update((nodes) => {
      for (const childNodeId of this.childNodes) {
        nodes[childNodeId].setPositionFromMovement(movementX, movementY);
      }
      return { ...nodes };
    });

    //update all the anchors on the node in the anchorsStore
    anchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchors[anchorId].nodeId === this.id) {
          anchors[anchorId].setPositionFromNode();
        }
      }
      return { ...anchors };
    });

    //update all the anchors on the node in the anchorsStore
    potentialAnchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchors[anchorId].nodeId === this.id) {
          anchors[anchorId].callback(); // we don't have to worry about setting partner anchors/etc;
        }
      }
      return { ...anchors };
    });

    resizeNodesStore.update((resAnchors) => {
      for (const anchorId in resAnchors) {
        if (resAnchors[anchorId].nodeId === this.id) {
          resAnchors[anchorId].setPosition(movementX, movementY);
          //resAnchors[anchorId].setPosition(movementX, movementY);
        }
      }
      return { ...resAnchors };
    });
  }

  //Sets the Width and Height of the Node base on ResizeNode's position
  setSizeFromMovement(movementX: number, movementY: number) {
    this.width += movementX;
    this.height += movementY;

    const { anchorsStore, potentialAnchorsStore } = stores[this.canvasId];

    //Updates the anchor so it follows the node's position as the dimensions change
    anchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchors[anchorId].nodeId === this.id) {
          anchors[anchorId].setPositionFromNode();
          //anchors[anchorId].setPosition(movementX, movementY);
        }
      }
      return { ...anchors };
    });

    //update all the anchors on the node in the anchorsStore
    potentialAnchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchors[anchorId].nodeId === this.id) {
          anchors[anchorId].callback(); // we don't have to worry about setting partner anchors/etc;
        }
      }
      return { ...anchors };
    });
  }

  /**
   * @function delete - will handle the deletion of a node (should waterfall down to delete anchors and edges)
   * @TODO implement this
   */
  delete() {
    const store = stores[this.canvasId];
    const { nodesStore, anchorsStore, edgesStore } = stores[this.canvasId];

    nodesStore.update((nodes) => {
      for (const nodeId in nodes) {
        if (nodes[nodeId].id === this.id) {
          delete nodes[nodeId];
        }
      }
      return { ...nodes };
    });

    // variable `anchors` is an array of Anchor objects on the node
    const anchors = getAnchors(store, { nodeId: this.id });
    for (let anchorSelf of anchors) {
      const edgeId = anchorSelf.edgeId;
      const edge = getEdgeById(store, edgeId);
      edge.delete(); // this also deletes anchors. TODO: maybe this should be renamed to explicitly say
    }

    // delete the resize nodes
    const resizeNodesArr = getResizeNodes(store, { nodeId: this.id });
    // there should be only 1 resize node if option is enabled, 0 if not enabled
    for (const resizeNode of resizeNodesArr) {
      resizeNode.delete();
    }

    // delete the potential anchors
    const potentialAnchorsArr = getPotentialAnchors(store, { nodeId: this.id });
    for (const potentialAnchor of potentialAnchorsArr) {
      potentialAnchor.delete();
    }
  }
}
