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
  userNode: UserNodeType | null,
  sourceOrTarget: 'source' | 'target',
  canvasId: string,
  edgeId: string
) {
  // edge case
  if (userNode === null)
    throw `you cannot create an anchor without a user node (for now)`;

  const id = uuidv4();

  // position is the position on the node where the anchor should be placed
  // specified by the user to be left, right, top, or bottom. If undefine,
  // defaults to bottom
  let position: 'left' | 'right' | 'top' | 'bottom' | undefined;
  if (sourceOrTarget === 'source') position = userNode.sourcePosition;
  else if (sourceOrTarget === 'target') position = userNode.targetPosition;
  if (position === undefined) position = 'bottom';

  // These are callbacks. It runs later
  // When it runs, it will set the position of the anchor depending on the position of the node
  // TODO: abstract this out so that people can define their own custom anchor positions
  const topCb = (): void => {
    // get node data
    const node = getNodes(store, { id: userNode.id })[0]; // TODO add error checking for zero
    const { positionX, positionY, width, height } = node;
    // calculate the position of the anchor and set
    const anchorsStore = get(store.anchorsStore);
    anchorsStore[id].positionX = positionX + width / 2;
    anchorsStore[id].positionY = positionY;
  };
  const bottomCb = (): void => {
    // get node data
    const node = getNodes(store, { id: userNode.id })[0]; // TODO add error checking for zero
    const { positionX, positionY, width, height } = node;
    // calculate the position of the anchor and set
    const anchorsStore = get(store.anchorsStore);
    anchorsStore[id].positionX = positionX + width / 2;
    anchorsStore[id].positionY = positionY + height;
  };
  const leftCb = (): void => {
    // get node data
    const node = getNodes(store, { id: userNode.id })[0]; // TODO add error checking for zero
    const { positionX, positionY, width, height } = node;
    // calculate the position of the anchor and set
    const anchorsStore = get(store.anchorsStore);
    anchorsStore[id].positionX = positionX;
    anchorsStore[id].positionY = positionY + height / 2;
  };
  const rightCb = (): void => {
    // get node data
    const node = getNodes(store, { id: userNode.id })[0]; // TODO add error checking for zero
    const { positionX, positionY, width, height } = node;
    // calculate the position of the anchor and set
    const anchorsStore = get(store.anchorsStore);
    anchorsStore[id].positionX = positionX + width;
    anchorsStore[id].positionY = positionY + height / 2;
  };

  let positionCb;
  if (position === 'top') positionCb = topCb;
  else if (position === 'bottom') positionCb = bottomCb;
  else if (position === 'left') positionCb = leftCb;
  else if (position === 'right') positionCb = rightCb;
  else positionCb = bottomCb;
  // Create a new anchor
  const anchor = new Anchor(
    id,
    userNode.id,
    edgeId,
    sourceOrTarget,
    -1,
    -1,
    positionCb,
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
      userEdge.id
    );
    // create target anchor
    const targetAnchor = createAnchor(
      store,
      targetUserNode,
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
      userNode.borderRadius
    );
    nodesStore[nodeId] = node;
  }
  store.nodesStore.set(nodesStore);
}
