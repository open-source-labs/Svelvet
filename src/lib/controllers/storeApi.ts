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

function createAnchor(
  store: StoreType,
  nodeId: string,
  sourceOrSink: string,
  canvasId: string
) {
  const anchorId = (Math.random() + 1).toString(36).substring(7);

  // This is a callback. It runs later
  // When it runs, it will set the position of the anchor depending
  // on the position of the node
  // TODO: abstract this out so that people can define their own custom anchor positions
  const anchor_cb = () => {
    // get node data
    const nodesStore = get(store.nodesStore);
    const positionX = nodesStore[nodeId].positionX;
    const positionY = nodesStore[nodeId].positionY;
    // calculate the position of the anchor and set
    const anchorsStore = get(store.anchorsStore);
    anchorsStore[anchorId].positionX = positionX;
    anchorsStore[anchorId].positionY = positionY;
  };

  // Create a new anchor
  const anchor = new Anchor(
    anchorId,
    nodeId,
    '', // edgeId
    sourceOrSink,
    -1,
    -1,
    anchor_cb,
    canvasId
  );
  // return
  return anchor;
}

function populateAnchorsStore(
  store: StoreType,
  edges: TypeUserEdge[],
  canvasId: string,
  mapLabelToId: { [key: string]: string }
) {
  // anchorsStore will populated and synchronized to store.anchorsStore
  const anchorsStore: { [key: string]: AnchorType } = {};
  const arr2 = [];

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    // source, target are userLabels, not ids. We need to use source and target to look up the appropriate node in nodesStore and find the node_id
    const { source: sourceUserLabel, target: targetUserLabel, type } = edge;
    // create source anchor
    const sourceNodeId = mapLabelToId[sourceUserLabel]; // TODO: refactor this out
    const sourceAnchor = createAnchor(store, sourceNodeId, 'source', canvasId);
    anchorsStore[sourceAnchor.id] = sourceAnchor;
    // create target anchor
    const targetNodeId = mapLabelToId[sourceUserLabel]; // TODO: refactor this out

    const targetAnchor = createAnchor(store, targetNodeId, 'source', canvasId);
    anchorsStore[targetAnchor.id] = targetAnchor;
  }

  //populates the anchorsStore
  store.anchorsStore.set(anchorsStore);
  //invoke callback to set each anchor's position based on the nodes
  // TODO: can we refactor this out and set x,y directly in function createAnchor?
  Object.values(get(store.anchorsStore)).forEach((el) => {
    el.callback();
  });
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
      userNode.id.toString(),
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
