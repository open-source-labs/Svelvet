/**
 * This model implements functionality for nodes to expand and collapse their children
 */

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
import type { CollapsibleType } from '../types/types';

/** Class that implements collapsible/expandable functionality for Node objects
 * @param {string} id Unique string that serves as a primary key
 * @param {string} nodeId Foreign key to a Node Object
 */
export class Collapsible implements CollapsibleType {
  constructor(
    public id: string,
    public nodeId: string,
    public hideCount: number
  ) {}
}
