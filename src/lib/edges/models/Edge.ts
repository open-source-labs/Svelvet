import {
  getNodes,
  getAnchors,
  findStore,
  getAnchorFromEdge,
  getEdgeById,
} from '../../store/controllers/storeApi';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
} from '$lib/store/types/types';
import { writable, derived, get, readable } from 'svelte/store';
import { stores } from '../../store/models/store';

export class Edge implements EdgeType {
  constructor(
    public id: string,
    public sourceX: number,
    public sourceY: number,
    public targetX: number,
    public targetY: number,
    public canvasId: string,
    public label?: string,
    public type?: string,
    public labelBgColor?: string,
    public labelTextColor?: string,
    public edgeColor?: string,
    public animate?: boolean,
    public noHandle?: boolean,
    public arrow?: boolean
  ) {}

  // Calling delete on an edge also deletes associated anchors
  // TODO: maybe rename delete to make clear that effects will cascade to anchors? Or is documentation enough?
  delete() {
    const store = stores[this.canvasId];
    const { nodesStore, anchorsStore, edgesStore } = store;
    const sourceAnchor = getAnchorFromEdge(store, this.id, 'source'); // this is a bit wasteful
    const targetAnchor = getAnchorFromEdge(store, this.id, 'target');
    anchorsStore.update((anchors) => {
      for (const anchorId in anchors) {
        if (anchorId === sourceAnchor.id || anchorId == targetAnchor.id)
          delete anchors[anchorId];
      }
      return { ...anchors };
    });
    edgesStore.update((edges) => {
      delete edges[this.id];
      return { ...edges };
    });
  }

  //this method is going to construct an object that holds all the edge data that can be exported
  setExportableData() {
    // public id: string,
    // public sourceX: number,
    // public sourceY: number,
    // public targetX: number,
    // public targetY: number,
    // public canvasId: string,
    // public label?: string,
    // public type?: string,
    // public labelBgColor?: string,
    // public labelTextColor?: string,
    // public edgeColor?: string,
    // public animate?: boolean,
    // public noHandle?: boolean,
    // public arrow?: boolean
    const exportableData = {
      id: this.id,
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      targetX: this.targetX,
      targetY: this.targetY,
      label: this.label,
      type: this.type,
      labelBgColor: this.labelBgColor,
      labelTextColor: this.labelTextColor,
      edgeColor: this.edgeColor,
      animate: this.animate,
      noHandle: this.noHandle,
      arrow: this.arrow
    }
    return exportableData;
  }
}
