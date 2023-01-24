/*


Important functions (in order of how likely I think you are to use them):

findStore(canvasId: string)
- Input: canvasId. There can be multiple Svelvet canvases on the same page, and each has their own store
- Returns: store
- Notes: You will need to call this function on every component you make

getNodes(store, filter)
- Description: this function returns of list of Node objects
- Input: store: the store where you get the list of Node objects from
-        filter: an object where you can filter the array. For example, if you want to find nodes with an id of 'sdf-2d3fs' and positionX=35, then you
                 would set filter = {id: 'sdf-2d3fs, positionX: 35}. 
                 Right now, you can only test for equality.
- Notes: This is a very mongoose way of retrieving information. Given the relational nature of our stores, maybe it would be better to use an SQL-like syntax
         This array is non-reactive (ie, you cannot use information from this array to force a re-render of a Svelte component)

getAnchors(store, filter)
- Description: same as getNodes, but for Anchor objects


createStoreEmpty(canvasId: string)
- Input: canvasId. 
- Returns: store
- Notes. This should be called once every time you initialize a new Svelvet canvas, (ie, only in the Svelvet.svelte file)

createStoreFromUserInput(canvasId, nodes, edges)
- canvasId: this the the canvasId of the Svelvet component you are creating a store for
- nodes: this is an array of objects containing node info that is defined by the user. NOTE THAT THE STRUCTURE DIFFERS FROM THE NODES CLASS
         The whole point of createStoreFromUserInput is to convert nodes into proper Svelvet Node objects. An example of nodes is in 
         $routes/testingplayground/index.svelte
- edges: same as nodes, this is an array of objects containing edge info THAT IS DIFFERENT FROM THE EDGE CLASS.
- Returns: store
- Notes: this is mis-named, it doesn't actually create a store it populates an existing store so "createStoreEmpty" must be called first.
         TODO: rename this


*/

import { stores } from '$lib/models/store';
import { writable, derived, get, readable } from 'svelte/store';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  UserNodeType,
  UserEdgeType,
} from '$lib/models/types';
// import { Anchor } from '$lib/models/Anchor';
// import { Node } from '$lib/models/Node';
// import { Edge } from '$lib/models/Edge';
import {
  populateAnchorsStore,
  populateNodesStore,
  populateEdgesStore,
  populateResizeNodeStore,
} from './util';

// Gets the source anchor for a given edge
export function getAnchorFromEdge(
  store: StoreType,
  edgeId: string,
  sourceOrTarget: 'source' | 'target'
): AnchorType {
  const edge = getEdgeById(store, edgeId);
  const anchors = getAnchors(store, { edgeId: edgeId });
  if (anchors.length !== 2)
    throw `there should be two anchors for a given edge, there are ${anchors.length}`;
  // there should be one source anchor and one target anchor. Return the source anchor
  const anchor = anchors.filter(
    (anchor) => anchor.sourceOrTarget === sourceOrTarget
  );
  if (anchor.length !== 1)
    throw `there should only be one source/target anchor`;
  return anchor[0];
}

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

export function getAnchorById(store: StoreType, id: string) {
  const anchorsStore = get(store.anchorsStore);
  const anchor = anchorsStore[id];
  return anchor;
}

export function getNodeById(store: StoreType, id: string) {
  const nodesStore = get(store.nodesStore);
  const node = nodesStore[id];
  return node;
}

export function getEdgeById(store: StoreType, id: string) {
  const edgesStore = get(store.edgesStore);
  const edge = edgesStore[id];
  if (edge === undefined) throw 'edge not found';
  return edge;
}

export function getNodes(
  store: StoreType,
  filter?: { [key: string]: any }
): NodeType[] {
  let nodes = Object.values(get(store.nodesStore));
  // filter the array of anchors for elements that match filter
  // Example: if filter = {sourceOrTarget: 'source', positionX: 35} then we will
  //          return all anchors with sourceOrTarget = source AND poxitionX = 35
  if (filter !== undefined) {
    nodes = nodes.filter((node) => {
      for (let filterKey in filter) {
        const filterValue = filter[filterKey];
        if (node[filterKey as keyof NodeType] !== filterValue) return false;
      }
      return true;
    });
  }
  // return list of nodes
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
    resizeNodesStore: writable({}),
    widthStore: writable(600),
    heightStore: writable(600),
    backgroundStore: writable(false),
    movementStore: writable(true),
    nodeSelected: writable(false),
    nodeIdSelected: writable(-1),
    d3Scale: writable(1),
  };
  return stores[canvasId];
}

export function createStoreFromUserInput(
  canvasId: string,
  nodes: UserNodeType[],
  edges: UserEdgeType[]
): void {
  // find the store
  const store = findStore(canvasId);
  // populate store.nodesStore with user nodes
  populateNodesStore(store, nodes, canvasId);
  // populate store.anchorsStore with anchors. Note the userdoes not explictly define anchors; anchors are calculated from the edges
  populateAnchorsStore(store, nodes, edges, canvasId);
  // populate edges
  populateEdgesStore(store, edges, canvasId);
  //populate resize Store
  populateResizeNodeStore(store, canvasId);
  // console.log(getAnchors(store));
}
