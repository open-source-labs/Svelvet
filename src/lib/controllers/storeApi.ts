import { stores } from '$lib/models/store';
import { writable, derived, get, readable } from 'svelte/store';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  TypeUserNode,
} from '$lib/models/types';
import { Edge, Anchor, Node } from '$lib/models/store';

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
  arrEdges: object[] // TODO: change arrEdges to edges
) {
  // find the store
  const store = findStore(canvasId);
  // populate store.nodesStore with user nodes
  const mapLabelToId = populateNodesStore(store, nodes, canvasId);
  return mapLabelToId;
}

function populateNodesStore(
  store: StoreType,
  nodes: TypeUserNode[],
  canvasId: string
) {
  // this is the nodesStore object
  const nodesStore: { [key: string]: NodeType } = {};
  // this is a map between userLabel : nodeId
  const mapLabelToId: { [key: string]: string } = {};
  // iterate through user nodes and create node objects
  for (let i = 0; i < nodes.length; i++) {
    const userNode: TypeUserNode = nodes[i];
    const nodeId: string = (Math.random() + 1).toString(36).substring(7);

    // TODO: refactor to object destructuring
    const node = new Node(
      nodeId,
      userNode.id,
      userNode.position.x,
      userNode.position.y,
      userNode.width,
      userNode.height,
      userNode.bgColor,
      JSON.stringify(userNode.data),
      canvasId
    );
    nodesStore[nodeId] = node;
    mapLabelToId[userNode.id.toString()] = nodeId;
  }
  store.nodesStore.set(nodesStore);

  return mapLabelToId;
}
