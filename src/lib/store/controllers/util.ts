import { v4 as uuidv4 } from 'uuid';
import {
  rightCb,
  leftCb,
  topCb,
  bottomCb,
} from '$lib/edges/controllers/anchorCbUser'; // these are callbacks used to calculate anchor position relative to node
import {
  dynamicCbCreator,
  fixedCbCreator,
  potentialAnchorCbCreator,
} from '$lib/edges/controllers/anchorCbDev';
import type {
  NodeType,
  EdgeType,
  AnchorType,
  StoreType,
  ResizeNodeType,
  UserNodeType,
  UserEdgeType,
  PotentialAnchorType,
} from '$lib/store/types/types';
import { ResizeNode } from '$lib/resizableNodes/models/ResizeNode';
import { Anchor } from '$lib/edges/models/Anchor';
import { Node } from '$lib/nodes/models/Node';
import { Edge } from '$lib/edges/models/Edge';
import { writable, derived, get, readable } from 'svelte/store';
import {
  getNodes,
  getAnchors,
  getNodeById,
  getAnchorById,
  getEdgeById,
} from './storeApi';
import { PotentialAnchor } from '$lib/interactiveNodes/models/PotentialAnchor';
/**
 *
 * @param store
 * @param canvasId
 * @returns
 */
function createResizeNode(
  canvasId: string,
  nodeId: string,
  posX: number,
  posY: number
) {
  const id = uuidv4();
  const resizeNode = new ResizeNode(id, canvasId, nodeId, posX, posY);
  return resizeNode;
}

function createAnchor(
  store: StoreType,
  userNode: UserNodeType | null,
  sourceOrTarget: 'source' | 'target',
  canvasId: string,
  edge: UserEdgeType
) {
  // edge case
  if (userNode === null)
    throw `you cannot create an anchor without a user node (for now)`;

  const edgeId = edge.id;
  const anchorId = uuidv4();

  // userCb is the appropriate source or taret callback from userEdge object. It is
  // possible the user to NOT set userCb in which case userCb will be undefined
  let userCb: Function;
  if (sourceOrTarget === 'target') userCb = edge.targetAnchorCb;
  else userCb = edge.sourceAnchorCb;

  // create anchor callbacks
  const dynamicCb = dynamicCbCreator(store, edgeId, anchorId);
  const fixedCb = fixedCbCreator(store, edgeId, anchorId, userNode.id, userCb);
  // Create a new anchor. The
  const anchor = new Anchor(
    anchorId,
    userNode.id,
    edgeId,
    sourceOrTarget,
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    userCb === undefined ? dynamicCb : fixedCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
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
      sourceAnchor.positionX,
      sourceAnchor.positionY,
      targetAnchor.positionX,
      targetAnchor.positionY,
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

function findUserNodeById(
  id: string,
  userNodes: UserNodeType[]
): UserNodeType | null {
  for (let i = 0; i < userNodes.length; i++) {
    const userNode = userNodes[i];
    if (userNode.id === id) return userNode;
  }
  return null;
}

function createPotentialAnchor(
  positionCb: Function,
  store: StoreType,
  userNode: UserNodeType,
  canvasId: string
) {
  const anchorId = uuidv4();
  const fixedCb = potentialAnchorCbCreator(
    store,
    anchorId,
    userNode.id,
    positionCb
  );
  // Create a new anchor. The
  const anchor = new PotentialAnchor(
    anchorId,
    userNode.id,
    fixedCb,
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    0, // dummy variables for x,y,angle for now
    canvasId
  );
  // return
  return anchor;
}

export function populatePotentialAnchorStore(
  store: StoreType,
  nodes: UserNodeType[],
  canvasId: string
) {
  // anchorsStore will populated and eventaully synchronized to store.anchorsStore
  const potentialAnchorsStore: { [key: string]: PotentialAnchorType } = {};
  // iterate through user nodes and create four anchors per node
  for (let i = 0; i < nodes.length; i++) {
    const userNode = nodes[i];

    // create 4 potentialAnchors
    for (let cb of [topCb, bottomCb, rightCb, leftCb]) {
      const anchor = createPotentialAnchor(cb, store, userNode, canvasId);
      // store potential anchors
      potentialAnchorsStore[anchor.id] = anchor;
    }
  }

  //populates the anchorsStore
  store.potentialAnchorsStore.set(potentialAnchorsStore);

  // set potentialAnchor positions. We can only set potentialAnchor positions after anchorsStore and nodesStore
  // has been populated. TODO: maybe add a check to see that anchorsStore and NodesStore populated?
  const potentialAnchors = Object.values(get(store.potentialAnchorsStore));
  for (const potentialAnchor of potentialAnchors) potentialAnchor.callback();
}

export function populateAnchorsStore(
  store: StoreType,
  nodes: UserNodeType[],
  edges: UserEdgeType[],
  canvasId: string
) {
  // anchorsStore will populated and eventaully synchronized to store.anchorsStore
  const anchorsStore: { [key: string]: AnchorType } = {};
  // iterate through user edges. Note the user never explicitly defines anchors; we calculate anchors
  // from the user edge/node information
  for (let i = 0; i < edges.length; i++) {
    const userEdge = edges[i];
    // find the source and target userNodes. These will be used to create the nodeId foreign key and
    // determine placement of the anchor based on userNode.targetPosition, useNode.sourcePosition
    const { source: sourceNodeId, target: targetNodeId } = userEdge;
    const sourceUserNode = findUserNodeById(sourceNodeId, nodes);
    const targetUserNode = findUserNodeById(targetNodeId, nodes);
    // create source anchor
    const sourceAnchor = createAnchor(
      store,
      sourceUserNode,
      'source',
      canvasId,
      userEdge
    );
    // create target anchor
    const targetAnchor = createAnchor(
      store,
      targetUserNode,
      'target',
      canvasId,
      userEdge
    );
    // store source and target anchors
    anchorsStore[sourceAnchor.id] = sourceAnchor;
    anchorsStore[targetAnchor.id] = targetAnchor;
  }

  //populates the anchorsStore
  store.anchorsStore.set(anchorsStore);

  // set anchor positions. We can only set anchor positions after anchorsStore and nodesStore
  // has been populated. TODO: maybe add a check to see that anchorsStore and NodesStore populated?
  const anchors = getAnchors(store);
  for (const anchor of anchors) anchor.callback();
}

export function populateNodesStore(
  store: StoreType,
  nodes: UserNodeType[],
  canvasId: string
) {
  // this is the nodesStore object. THIS IS NOT THE SAME AS A NODESTORE
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
      userNode.data,
      canvasId,
      userNode.borderColor,
      userNode.image,
      userNode.src,
      userNode.textColor,
      userNode.borderRadius,
      userNode.childNodes === undefined ? [] : userNode.childNodes,
      userNode.className
    );

    nodesStore[nodeId] = node;
  }
  // This is actually what sets the store
  store.nodesStore.set(nodesStore);
}

export function populateResizeNodeStore(
  store: StoreType,
  nodes: UserNodeType[],
  canvasId: string
) {
  const resizeNodeStore: { [key: string]: ResizeNodeType } = {};

  for (let i = 0; i < nodes.length; i++) {
    const userNode = nodes[i];
    const { id, width, height, position } = userNode;
    const resizeNode = createResizeNode(
      canvasId,
      id,
      position.x + width,
      position.y + height
    );
    resizeNodeStore[resizeNode.id] = resizeNode;
  }
  // console.log(resizeNode);
  // console.log('ResizeNodeStore', resizeNodeStore);
  store.resizeNodesStore.set(resizeNodeStore);
}
