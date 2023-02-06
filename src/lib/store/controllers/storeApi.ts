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

populateSvelvetStoreFromUserInput(canvasId, nodes, edges)
- canvasId: this the the canvasId of the Svelvet component you are creating a store for
- nodes: this is an array of objects containing node info that is defined by the user. NOTE THAT THE STRUCTURE DIFFERS FROM THE NODES CLASS
         The whole point of populateSvelvetStoreFromUserInput is to convert nodes into proper Svelvet Node objects. An example of nodes is in 
         $routes/testingplayground/index.svelte
- edges: same as nodes, this is an array of objects containing edge info THAT IS DIFFERENT FROM THE EDGE CLASS.
- Returns: store


*/
import { v4 as uuidv4 } from 'uuid';
import {
  dynamicCbCreator,
  fixedCbCreator,
  potentialAnchorCbCreator,
} from '../../edges/controllers/anchorCbDev';
import { stores } from '../models/store';
import { writable, derived, get, readable } from 'svelte/store';
import type { AnchorCbType, AnchorType } from '../../edges/types/types';

import type {
  NodeType,
  EdgeType,
  StoreType,
  UserNodeType,
  UserEdgeType,
  TemporaryEdgeType,
  ResizeNodeType,
  PotentialAnchorType,
} from '../types/types';
import { Anchor } from '../../edges/models/Anchor';
import { Node } from '../../nodes/models/Node';
import { Edge } from '../../edges/models/Edge';
import {
  populateAnchorsStore,
  populateNodesStore,
  populateEdgesStore,
  populateResizeNodeStore,
  populatePotentialAnchorStore,
} from './util';
import { TemporaryEdge } from '../../interactiveNodes/models/TemporaryEdge';
import { populateCollapsibleStore } from '$lib/collapsible/controllers/util';

/**
 * Gets one anchor (source anchor or target anchor) from a given edge
 *
 * @param store The Svelvet store containing the state of the Svelvet component
 * @param edgeId The id of a given edge
 * @param sourceOrTarget A string of 'source' or 'target' to specify which anchor the function should return
 * @returns The source or target Anchor object of a given edge
 */
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

/**
 * Finds all Anchors that matches the conditions specified in the filter parameter from a Svelvet store and returns these Anchors in an array.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param filter An object to specify conditions. Example: if filter = {sourceOrTarget: 'source', positionX: 35} then we will return all anchors with sourceOrTarget = source AND poxitionX = 35
 * @returns An array of Anchors that matches the conditions specified in the filter parameter
 */
export function getAnchors(store: StoreType, filter?: { [key: string]: any }) {
  let anchors = Object.values(get(store.anchorsStore));
  // filter the array of anchors for elements that match filter
  // Example: if filter = {sourceOrTarget: 'source', positionX: 35} then we will
  //return all anchors with sourceOrTarget = source AND poxitionX = 35
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

/**
 * Finds all resizeNodes that matches the conditions specified in the filter parameter from a Svelvet store and returns these resizeNodes in an array
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param filter An object to specify conditions.
 * @returns An array of resizeNode objects that matches the conditions specified in filter parameter
 */
export function getResizeNodes(
  store: StoreType,
  filter?: { [key: string]: any }
) {
  let resizeNodes = Object.values(get(store.resizeNodesStore));
  // filter the array for elements that match filter
  if (filter !== undefined) {
    resizeNodes = resizeNodes.filter((resizeNode) => {
      for (let filterKey in filter) {
        const filterValue = filter[filterKey];
        if (resizeNode[filterKey as keyof ResizeNodeType] !== filterValue)
          return false;
      }
      return true;
    });
  }
  // return list of anchors
  return resizeNodes;
}

/**
 * Finds all potentialAnchors that matches the conditions specified in the filter parameter from a Svelvet store and returns these potential anchors in an array
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param filter An object to specify conditions.
 * @returns An array of potential anchors that matches the conditions specified in filter parameter
 */
export function getPotentialAnchors(
  store: StoreType,
  filter?: { [key: string]: any }
) {
  let potentialAnchorsArr = Object.values(get(store.potentialAnchorsStore));
  // filter the array for elements that match filter
  if (filter !== undefined) {
    potentialAnchorsArr = potentialAnchorsArr.filter((potentialAnchor) => {
      for (let filterKey in filter) {
        const filterValue = filter[filterKey];
        if (
          potentialAnchor[filterKey as keyof PotentialAnchorType] !==
          filterValue
        )
          return false;
      }
      return true;
    });
  }
  // return list of anchors
  return potentialAnchorsArr;
}

/**
 * getAnchorById will look for the targeted Anchor that has the same id in the Svelvet component store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param id The id of the targeted Anchor
 * @returns The target Anchor object in store.anchorsStore
 */
export function getAnchorById(store: StoreType, id: string) {
  const anchorsStore = get(store.anchorsStore);
  const anchor = anchorsStore[id];
  return anchor;
}

/**
 * getNodeById will look for the targeted Node that has the same id provided in the Svelvet component store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param id The id of the targeted Node
 * @returns The targeted Node object in store.nodesStore
 */

export function getNodeById(store: StoreType, id: string) {
  const nodesStore = get(store.nodesStore);
  const node = nodesStore[id];
  return node;
}

/**
 * getEdgeById will look for the targeted Edge that has the same id provided in the Svelvet component store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param id The id of the targeted Node
 * @returns The targeted Edge object in store.edgesStore
 */
export function getEdgeById(store: StoreType, id: string) {
  const edgesStore = get(store.edgesStore);
  const edge = edgesStore[id];
  if (edge === undefined) throw 'edge not found';
  return edge;
}

/**
 * getPotentialAnchorById will look for the targeted potential Anchor that has the same id provided in the Svelvet component store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param id The id of the targeted potential Anchor
 * @returns The targeted potential Anchor object in store.potentialAnchorsStore
 */
export function getPotentialAnchorById(store: StoreType, id: string) {
  const potentialAnchorsStore = get(store.potentialAnchorsStore);
  const potentialAnchor = potentialAnchorsStore[id];
  if (potentialAnchor === undefined) throw 'potential anchor not found';
  return potentialAnchor;
}

/**
 * Finds all Nodes that matches the conditions specified in the filter parameter from a Svelvet store and returns these Nodes in an array
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param filter An object to specify conditions.
 * @returns An array of Node objects that matches the conditions specified in filter parameter. This array is non-reactive (ie, you cannot use information from this array to force a re-render of a Svelte component)
 */
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

/**
 * findStore is going to return the target Svelvet store with the canvasId provided as argument.
 * There can be multiple Svelvet canvases on the same page, and each has their own store with a unique canvasId.
 * @param canvasId The canvasId of a Svelvet component
 * @returns The store of a Svelvet component that matches the canvasId
 */
export function findStore(canvasId: string): StoreType {
  return stores[canvasId];
}

/**
 * createStoreEmpty will initialize a new Svelvet store with a unique canvasId.
 * If you have multiple Svelvet components on the page, the stores object will look like the following example:
 * const stores = {
 *                  canvasId-1: store of Svelvet component 1,
 *                  canvasId-2: store of Svelvet component 2,
 *                  canvasId-3: store of Svelvet component 3,
 *                }
 * Notes: This should be called once every time you initialize a new Svelvet canvas, (ie, only in the Svelvet.svelte file).
 * This function will initialize an empty store for the Svelvet component and should be followed by invoking populateSvelvetStoreFromUserInput to populate all the initial state from the user input.
 *
 * @param canvasId The canvasId of the newly created Svelvet component
 * @returns An empty store for the newly created Svelvet component.
 */
export function createStoreEmpty(canvasId: string): StoreType {
  stores[canvasId] = {
    nodesStore: writable({}),
    edgesStore: writable({}),
    anchorsStore: writable({}),
    resizeNodesStore: writable({}),
    potentialAnchorsStore: writable({}),
    widthStore: writable(600),
    heightStore: writable(600),
    backgroundStore: writable(false),
    movementStore: writable(true),
    nodeSelected: writable(false),
    nodeIdSelected: writable(-1),
    d3Scale: writable(1),
    options: writable({}),
    temporaryEdgeStore: writable([]),
    nodeCreate: writable(false), // this option sets whether the "nodeEdit" feature is enabled
    boundary: writable(false),
    edgeEditModal: writable(null), // this is used for edgeEditModal feature. When an edge is right clicked, store.edgeEditModal is set to the edgeId string. This causes a modal to be rendered
    collapsible: writable([]), // this is used for the collaspsible node feature. If the feature is enabled, store.collapsible will be populated with Collapsible objects which will track whether the node should be displayed or not
  };
  return stores[canvasId];
}

/**
 * populateSvelvetStoreFromUserInput will populate all the states and set these states into the Svelvet store initialized by invoking createStoreEmpty
 *
 * @param canvasId The canvasId of the Svelvet component you are creating a store for
 * @param nodes This is an array of objects containing node info that is defined by the user. NOTE THAT THE STRUCTURE DIFFERS FROM THE NODES CLASS. The whole point of populateSvelvetStoreFromUserInput is to convert nodes into proper Svelvet Node objects. An example of nodes is in $routes/testingplayground/index.svelte
 * @param edges Same as nodes, this is an array of objects containing edge info THAT IS DIFFERENT FROM THE EDGE CLASS.
 */
export function populateSvelvetStoreFromUserInput(
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
  populateResizeNodeStore(store, nodes, canvasId);
  //populate potential anchors if "node create" feature is turend on
  if (get(store.nodeCreate)) {
    populatePotentialAnchorStore(store, nodes, canvasId);
  }
  populateCollapsibleStore(store, nodes, edges, canvasId);
}

/**
 * Creates a new edge and two adaptive anchor points and updates the edgesStore and anchorsStore.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param sourceNodeId The id of the source Node
 * @param targetNodeId The id of the target Node
 * @param canvasId The canvasId of a Svelvet component
 */
export function createEdgeAndAnchors(
  store: StoreType,
  sourceNodeId: string,
  targetNodeId: string,
  canvasId: string
) {
  // create an edge
  const edgeId = uuidv4();
  const newEdge = new Edge(
    edgeId,
    -1,
    -1,
    -1,
    -1,
    canvasId,
    undefined, // undefined defaults to no label
    undefined, // type=undefined defaults to bezier curve
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );

  // create source anchor
  const sourceAnchorId = uuidv4();
  const sourceDynamicCb = dynamicCbCreator(store, edgeId, sourceAnchorId);
  const sourceAnchor = new Anchor(
    sourceAnchorId,
    sourceNodeId,
    edgeId,
    'source',
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    sourceDynamicCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
  );

  // create target anchor
  const targetAnchorId = uuidv4();
  const targetDynamicCb = dynamicCbCreator(store, edgeId, targetAnchorId);
  const targetAnchor = new Anchor(
    targetAnchorId,
    targetNodeId,
    edgeId,
    'target',
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    targetDynamicCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
  );

  // put everything into the store
  const { edgesStore, anchorsStore } = store;

  anchorsStore.update((anchors) => {
    anchors[sourceAnchorId] = sourceAnchor;
    anchors[targetAnchorId] = targetAnchor;
    return { ...anchors };
  });
  edgesStore.update((edges) => {
    edges[edgeId] = newEdge;
    return { ...edges };
  });

  // make sure to update positions. TODO: don't need to do this for the entire store
  const anchors = getAnchors(store);
  for (const anchor of anchors) anchor.callback();
}

/**
 * Creates a new Node when user drags the Edge and releases mouse at a new spot. This functionality is needed for the "create new node by dragging" feature. See TemporaryEdge.createNode()
 * This function has no output, but alters the store. New Node/Edge/Anchor objects are added to the store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param sourceNodeId The id of the source Node
 * @param targetNodeX The postion X where user releases the mouse, which should be the x-axis position for the new Node
 * @param targetNodeY The postion Y where user releases the mouse, which should be the y-axis position for the new Node
 * @param canvasId The canvasId of a Svelvet component
 */
export function createNode(
  store: StoreType,
  sourceNodeId: string,
  targetNodeX: number,
  targetNodeY: number,
  canvasId: string
) {
  // create a new node
  const targetNodeId = uuidv4();
  const node = new Node(
    targetNodeId,
    targetNodeX,
    targetNodeY,
    100, // width
    100, // height
    'white', // background color
    {
      label: 'new node',
    },
    canvasId,
    'black', // borderColor
    false, //  Node has an image
    '', // src, not sure what this does
    'black', // text color
    0, // borderRadius
    []
  );

  // create an edge
  const edgeId = uuidv4();
  const newEdge = new Edge(
    edgeId,
    -1,
    -1,
    -1,
    -1,
    canvasId,
    undefined, // undefined defaults to no label
    undefined, // type=undefined defaults to bezier curve
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );

  // create source anchor
  const sourceAnchorId = uuidv4();
  const sourceDynamicCb = dynamicCbCreator(store, edgeId, sourceAnchorId);
  const sourceAnchor = new Anchor(
    sourceAnchorId,
    sourceNodeId,
    edgeId,
    'source',
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    sourceDynamicCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
  );

  // create target anchor
  const targetAnchorId = uuidv4();
  const targetDynamicCb = dynamicCbCreator(store, edgeId, targetAnchorId);
  const targetAnchor = new Anchor(
    targetAnchorId,
    targetNodeId,
    edgeId,
    'target',
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    targetDynamicCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
  );

  // put everything into the store
  const { nodesStore, edgesStore, anchorsStore } = store;

  nodesStore.update((nodes) => {
    nodes[targetNodeId] = node;
    return { ...nodes };
  });

  anchorsStore.update((anchors) => {
    anchors[sourceAnchorId] = sourceAnchor;
    anchors[targetAnchorId] = targetAnchor;
    return { ...anchors };
  });
  edgesStore.update((edges) => {
    edges[edgeId] = newEdge;
    return { ...edges };
  });
  // make sure to update positions. TODO: don't need to do this for the entire store
  const anchors = getAnchors(store);
  for (const anchor of anchors) anchor.callback();
}
