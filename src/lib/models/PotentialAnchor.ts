// this class is for the 4 potential anchors that appear on each node

import type { PotentialAnchorType } from './types';
import { writable, derived, get, readable } from 'svelte/store';
import { getNodes, getAnchors, findStore } from '../controllers/storeApi';
import { stores } from './store';

/** Class representing an anchor with a Anchortype alias */
export class PotentialAnchor implements PotentialAnchorType {
  /**
   * creates a potential anchor.
   * Users can create edges by linking two potential anchors
   */
  constructor(
    public id: string,
    public nodeId: string,
    public callback: Function, // callback is used to calculate positionX, positionY based on parent node's data, and set the anchor position // TODO: rename to something better
    public positionX: number,
    public positionY: number,
    public angle: number,
    public deleteAndCascade: Function
  ) {}
}
