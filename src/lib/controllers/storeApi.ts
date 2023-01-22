import { stores } from '$lib/models/store';
import { writable, derived, get, readable } from 'svelte/store';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  TypeUserNode,
  TypeUserEdge,
} from '$lib/models/types';
import { Edge, Anchor, Node } from '$lib/models/store';
import { populateAnchorsStore, populateNodesStore } from './util';

export function findStore(canvasId: string): StoreType {
  return stores[canvasId];
}

export function createStoreEmpty(canvasId: string): StoreType {
  stores[canvasId] = {
    nodesStore: writable({}),
    edgesStore: writable({}),
    anchorsStore: writable({}),
  };
  return stores[canvasId];
}

export function createStoreFromUserInput(
  canvasId: string,
  nodes: TypeUserNode[],
  edges: TypeUserEdge[]
) {
  // find the store
  const store = findStore(canvasId);
  // populate store.nodesStore with user nodes
  const mapLabelToId = populateNodesStore(store, nodes, canvasId);
  // populate store.edgesStore with user edges
  populateAnchorsStore(store, edges, canvasId, mapLabelToId);
  return mapLabelToId;
}
