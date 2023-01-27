// table for the "connecting edge" feature
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
  TemporaryEdgeType,
} from './types';
import { writable, derived, get, readable } from 'svelte/store';
import { getNodes, getAnchors, findStore } from '../controllers/storeApi';
import { stores } from './store';

export class TemporaryEdge implements TemporaryEdgeType {
  constructor(
    public id: string,
    public sourcePotentialAnchorId: string, // this will always be set
    public sourceX: number,
    public sourceY: number,
    public targetPotentialAnchorId: string | null, // this will be null until the temporary edge reaches another temporary anchor
    public targetX: number,
    public targetY: number,
    public canvasId: string,
    public type: string,
    public edgeColor: string
  ) {}

  createEdge() {
    console.log('doing temporaryEdge.createEdge');
  }
}
