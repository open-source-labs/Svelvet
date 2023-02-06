import type {
  StoreType,
  UserEdgeType,
  UserNodeType,
} from '$lib/store/types/types';
import { Collapsible } from '../models/Collapsible';
import { v4 as uuidv4 } from 'uuid';
import type { CollapsibleType } from '../types/types';
import { writable, derived, get, readable } from 'svelte/store';
import { getAnchorById, getAnchors } from '../../store/controllers/storeApi';
/*
Initializes store with array of Collapsible objects. You shoould only use this if you want the collapsible feature enabled.
*/
export function populateCollapsibleStore(
  store: StoreType,
  userNodes: UserNodeType[],
  userEdges: UserEdgeType[],
  canvasId: string
) {
  const newCollapsibleStore: CollapsibleType[] = [];
  for (let userNode of userNodes) {
    const collapsible = new Collapsible(uuidv4(), userNode.id, 0);
    newCollapsibleStore.push(collapsible);
  }
  store.collapsibleStore.set(newCollapsibleStore);
}

/*

*/
function incrementHideCount(store: StoreType, nodeId: string) {
  const collapsibles = get(store.collapsibleStore);
  for (let collapsible of collapsibles)
    if (collapsible.nodeId === nodeId) collapsible.hideCount++;
  store.collapsibleStore.set(collapsibles);
}

// Given a nodeId, find ids of all connecting target nodes
function findTargets(store: StoreType, nodeId: string): string[] {
  // get source anchors on the node
  const anchors = getAnchors(store, {
    nodeId: nodeId,
    sourceOrTarget: 'source',
  });

  // get target anchors on other node, and record the node id
  const targetNodeIds: string[] = [];
  for (const anchor of anchors) {
    const targetAnchorId = anchor.getOtherAnchorId();
    const targetAnchor = getAnchorById(store, targetAnchorId);
    targetNodeIds.push(targetAnchor.nodeId);
  }
  return targetNodeIds;
}

// traverses tree and increments hideCount
function traverseAndIncrement(store: StoreType, nodeId: string) {
  const collapsibles = get(store.collapsibleStore);
  recursiveTraverse(nodeId);
  store.collapsibleStore.set(collapsibles);

  function recursiveTraverse(nId: string) {
    for (const collapsible of collapsibles) {
      if (collapsible.nodeId === nId) {
        collapsible.hideCount++;
        const targetIds = findTargets(store, nId);
        for (const targetId of targetIds) {
          recursiveTraverse(targetId);
        }
      }
    }
  }
}

export function collapse(store: StoreType, nodeId: string) {
  const targetNodeIds = findTargets(store, nodeId);
  for (const targetNodeId of targetNodeIds)
    traverseAndIncrement(store, targetNodeId);
}
