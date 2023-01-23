import { v4 as uuidv4 } from 'uuid';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  UserNodeType,
  UserEdgeType,
} from '$lib/models/types';
import { Edge, Anchor, Node } from '$lib/models/store';
import { writable, derived, get, readable } from 'svelte/store';
import { getNodes, getAnchors } from './storeApi';

function createAnchor(
  store: StoreType,
  nodeId: string,
  sourceOrTarget: 'source' | 'target',
  canvasId: string,
  edgeId: string
) {
  const id = uuidv4();

  // This is a callback. It runs later
  // When it runs, it will set the position of the anchor depending
  // on the position of the node
  // TODO: abstract this out so that people can define their own custom anchor positions
  const anchor_cb = () => {
    // get node data
    const node = getNodes(store, { id: nodeId })[0];
    const { positionX, positionY, width, height } = node;
    // calculate the position of the anchor and set
    const anchorsStore = get(store.anchorsStore);
    anchorsStore[id].positionX = positionX + width / 2;
    anchorsStore[id].positionY = positionY;
  };

  // Create a new anchor
  const anchor = new Anchor(
    id,
    nodeId,
    edgeId,
    sourceOrTarget,
    -1,
    -1,
    anchor_cb,
    canvasId
  );
  // return
  return anchor;
}

export function populateEdgesStore(
  store: StoreType,
  edges: UserEdgeType[],
  canvasId: string
) {
  const edgesStore: { [key: string]: EdgeType } = {};
  for (let i = 0; i < edges.length; i++) {
    const userEdge = edges[i];
    //  { id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
    // source is node.id for the source node
    // target is node.id for the target node
    // We need to get the anchors
    const {
      source: sourceNodeId,
      target: targetNodeId,
      id: edgeId,
      type,
      label,
      labelBgColor,
      labelTextColor,
      edgeColor,
      animate,
      noHandle,
      arrow,
    } = userEdge;

    const anchors = getAnchors(store, { edgeId: edgeId });
    // check that we have two anchors for every edge
    if (anchors.length !== 2) throw 'We should have two anchors for every node';
    // check that we have 1 source anchor and 1 target anchor. Since sourceOrTarget is typed to be either 'source'
    //   or 'target', it suffices to check whether there are two unique elements
    if (new Set(anchors.map((e) => e.sourceOrTarget)).size !== 2)
      throw 'we should have one source and one target anchor';
    // get source and target anchor
    let sourceAnchor, targetAnchor;
    if (anchors[0].sourceOrTarget === 'source') {
      sourceAnchor = anchors[0];
      targetAnchor = anchors[1];
    } else {
      sourceAnchor = anchors[1];
      targetAnchor = anchors[0];
    }

    edgesStore[edgeId] = new Edge(
      edgeId,
      sourceNodeId.toString(),
      targetNodeId.toString(),
      sourceAnchor.positionX,
      sourceAnchor.positionY,
      targetAnchor.positionX,
      targetAnchor.positionY,
      sourceAnchor.id,
      targetAnchor.id,
      canvasId,
      label,
      type,
      labelBgColor,
      labelTextColor,
      edgeColor,
      animate,
      noHandle,
      arrow
    );
  }
  store.edgesStore.set(edgesStore);
}

export function populateAnchorsStore(
  store: StoreType,
  edges: UserEdgeType[],
  canvasId: string
) {
  // anchorsStore will populated and synchronized to store.anchorsStore
  const anchorsStore: { [key: string]: AnchorType } = {};
  for (let i = 0; i < edges.length; i++) {
    const userEdge = edges[i];
    const { source: sourceNodeId, target: targetNodeId, type } = userEdge;
    // create source anchor
    const sourceAnchor = createAnchor(
      store,
      sourceNodeId.toString(),
      'source',
      canvasId,
      userEdge.id
    );
    // create target anchor
    const targetAnchor = createAnchor(
      store,
      targetNodeId.toString(),
      'target',
      canvasId,
      userEdge.id
    );
    // store source and target anchors
    anchorsStore[sourceAnchor.id] = sourceAnchor;
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

export function populateNodesStore(
  store: StoreType,
  nodes: UserNodeType[],
  canvasId: string
) {
  // this is the nodesStore object
  const nodesStore: { [key: string]: NodeType } = {};
  // iterate through user nodes and create node objects
  for (let i = 0; i < nodes.length; i++) {
    const userNode: UserNodeType = nodes[i];
    const nodeId = userNode.id;

    const node = new Node(
      nodeId.toString(),
      userNode.position.x,
      userNode.position.y,
      userNode.width,
      userNode.height,
      userNode.bgColor,
      JSON.stringify(userNode.data),
      canvasId,
      userNode.borderColor,
      userNode.image,
      userNode.src,
      userNode.textColor,
      userNode.targetPosition,
      userNode.sourcePosition,
      userNode.borderRadius
    );
    nodesStore[nodeId] = node;
  }
  store.nodesStore.set(nodesStore);
}
