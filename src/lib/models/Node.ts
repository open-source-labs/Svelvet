/** this is where we create our node store */
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
    public childNodes: string[]
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
    console.log('working on waterfall down to delete anchors and edges');

    const { nodesStore, anchorsStore, edgesStore } = stores[this.canvasId];

    const deletedNode = this;

    nodesStore.update((nodes) => {
      for (const nodeId in nodes) {
        if (nodes[nodeId].id === this.id) {
          delete nodes[nodeId];
        }
      }
      return { ...nodes };
    });

    console.log('the deleted node is => ', deletedNode);

    let deletedAnchor;

    //use the deletedNode info to delete anchors
    anchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchors[anchorId].nodeId === deletedNode.id) {
          deletedAnchor = anchors[anchorId];
          //use the deletedAnchor info to delete edges
          let deletedEdge;
          edgesStore.update((edges) => {
            for (const edgeId in edges) {
              if (edges[edgeId].id === deletedAnchor.edgeId) {
                deletedEdge = edges[edgeId];
                delete edges[edgeId];
              }
            }
            return { ...edges };
          });
          delete anchors[anchorId];
        }
      }
      return { ...anchors };
    });
  }
}
