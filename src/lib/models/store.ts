import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
} from './types';
import { writable, derived, get, readable } from 'svelte/store';
import { getNodes, getAnchors, findStore } from '../controllers/storeApi';

/*
  `store` is a dictionary of Svelvet stores.
    * The reason why we have multiple Svelvet stores is to handle multiple canvases on the same page.
    * A Svelvet store is the single source of truth for a canvas state.
    * We discourage developers from interacting with stores directly; instead use the api methods in 
      `$lib/controllers/storeApi.ts`. However, if need to direct access you can do so by importing:
      `import { store } from '$lib/models/store';`
    *
*/
export const stores: { [key: string]: StoreType } = {};

export class ResizeNode implements ResizeNodeType {
  constructor(
    public id: string,
    public canvasId: string,
    public positionX: number,
    public positionY: number
  ) {}
}
