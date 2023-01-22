import { stores } from '$lib/models/store';
import { writable, derived, get, readable } from 'svelte/store';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
} from '$lib/models/types';

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

export function createStoreFromUserInput(canvasId: string): StoreType {
  const store = createStoreEmpty(canvasId);
  return store;
}
