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
  edgeUserLabel: string
) {
  const anchorId = uuidv4();

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
    edgeUserLabel,
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
    // source is node.userLabel for the source node
    // target is node.userLabel for the target node
    // We need to get the anchors
    const {
      source: sourceNodeUserLabel,
      target: targetNodeUserLabel,
      id: edgeUserLabel,
      type,
    } = userEdge;

    const anchors = getAnchors(store, { edgeUserLabel: edgeUserLabel });
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

    // create edge
    const edgeId = uuidv4();
    edgesStore[edgeId] = new Edge(
      edgeId,
      sourceNodeUserLabel.toString(),
      targetNodeUserLabel.toString(),
      type,
      sourceAnchor.positionX.toString(),
      sourceAnchor.positionY.toString(),
      targetAnchor.positionX.toString(),
      targetAnchor.positionY,
      +sourceAnchor.id,
      +targetAnchor.id,
      +canvasId
      //Manually Converted values to their respective Types... Consult with team.
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
  // calculate mapNodeUserLabelToId, which is an object that maps node.userLabel to node.id
  // Example usage: const nodeId = mapNodeUserLabelToId[nodeUserLabel]
  const nodes = getNodes(store);
  const arrNodeIdsAndUserLabels = nodes.map((node) => [
    node.userLabel,
    node.id,
  ]);
  const mapNodeUserLabelToId = Object.fromEntries(arrNodeIdsAndUserLabels);

  for (let i = 0; i < edges.length; i++) {
    const userEdge = edges[i];
    // source, target are userLabels, not ids. We need to use source and target to look up the appropriate node in nodesStore and find the node_id
    const { source: sourceUserLabel, target: targetUserLabel, type } = userEdge;
    // create source anchor
    const sourceNodeId = mapNodeUserLabelToId[sourceUserLabel]; // TODO: refactor this out
    const sourceAnchor = createAnchor(
      store,
      sourceNodeId,
      'source',
      canvasId,
      userEdge.id
    );
    anchorsStore[sourceAnchor.id] = sourceAnchor;
    // create target anchor
    const targetNodeId = mapNodeUserLabelToId[targetUserLabel]; // TODO: refactor this out
    const targetAnchor = createAnchor(
      store,
      targetNodeId,
      'target',
      canvasId,
      userEdge.id
    );
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
  // this is a map between userLabel : nodeId
  const mapLabelToId: { [key: string]: string } = {};
  // iterate through user nodes and create node objects
  for (let i = 0; i < nodes.length; i++) {
    const userNode: UserNodeType = nodes[i];
    const nodeId: string = uuidv4();

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
