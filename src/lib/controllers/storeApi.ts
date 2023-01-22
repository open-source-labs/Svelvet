import { stores } from '$lib/models/store';
import { writable, derived, get, readable } from 'svelte/store';

export function findStore(canvasId: string) {
  return stores[canvasId];
}

export function createStore(canvasId: string) {
  stores[canvasId] = {
    nodesStore: writable({}),
    edgesStore: writable({}),
    anchorsStore: writable({}),
  };
  return stores[canvasId];
}
