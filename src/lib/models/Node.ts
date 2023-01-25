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
 * @param {string} data - //note sure
 * @param {string} canvasId - //note sure
 * @param {string} borderColor - border color of node
 * @param {boolean} image - //not sure
 * @param {string} src - //not sure
 * @param {string} textColor - the color of the text in the node
 * @param {string} borderRadius - //not sure
 */
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
  /**
   * @function setPosition -
   * @param {number} movementX - 
   * @param {number} movementy - 
   */
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
  /**
   * @function delete - will handle the deletion of a node (should waterfall down to delete anchors and edges)
   * @TODO implement this
   */
  delete() {
    console.log('working on waterfall down to delete anchors and edges');
    
    const { nodesStore } = stores[this.canvasId];

    const deletedNode = this

    nodesStore.update((nodes) => {
      for (const nodeId in nodes) {
        if (nodes[nodeId].id === this.id) {
          delete nodes[nodeId];
        }
      }
      return {...nodes}
    })
    

    console.log('the deleted node is => ', deletedNode);

    //should use the deletedNode info to delete anchors and edges
    
  }
}
