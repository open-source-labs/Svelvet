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

export class ResizeNode implements ResizeNodeType {
  constructor(
    public id: string,
    public canvasId: string,
    public positionX: number,
    public positionY: number
  ) {}
}
