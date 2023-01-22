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
import {
  populateAnchorsStore,
  populateNodesStore,
  populateEdgesStore,
} from './util';

export function getAnchors(store: StoreType, filter?: { [key: string]: any }) {
  let anchors = Object.values(get(store.anchorsStore));
  // filter the array of anchors for elements that match filter
  // Example: if filter = {sourceOrTarget: 'source', positionX: 35} then we will
  //          return all anchors with sourceOrTarget = source AND poxitionX = 35
  if (filter !== undefined) {
    anchors = anchors.filter((anchor) => {
      for (let filterKey in filter) {
        const filterValue = filter[filterKey];
        if (anchor[filterKey as keyof AnchorType] !== filterValue) return false;
      }
      return true;
    });
  }
  // return list of anchors
  return anchors;
}

export function getNodes(store: StoreType, filter?: object): NodeType[] {
  const nodes = Object.values(get(store.nodesStore));
  // TODO: implement filtering
  return nodes;
}

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
  populateNodesStore(store, nodes, canvasId);
  // populate store.anchorsStore with anchors. Note the userdoes not explictly
  // define anchors; anchors are calculated from the edges
  populateAnchorsStore(store, edges, canvasId);
  // populate edges
  populateEdgesStore(store, edges, canvasId);
}
