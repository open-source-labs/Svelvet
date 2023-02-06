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
    const collapsible = new Collapsible(uuidv4(), userNode.id, 0, 'expanded');
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
function traverseAndIncrement(
  store: StoreType,
  nodeId: string,
  operation: 'increment' | 'decrement'
) {
  const collapsibles = get(store.collapsibleStore);
  recursiveTraverse(nodeId);
  store.collapsibleStore.set(collapsibles);

  function recursiveTraverse(nId: string) {
    for (const collapsible of collapsibles) {
      if (collapsible.nodeId === nId) {
        if (operation === 'increment') collapsible.hideCount++;
        else collapsible.hideCount--;
        const targetIds = findTargets(store, nId);
        for (const targetId of targetIds) {
          recursiveTraverse(targetId);
        }
      }
    }
  }
}

function collapse(store: StoreType, nodeId: string) {
  const targetNodeIds = findTargets(store, nodeId);
  for (const targetNodeId of targetNodeIds)
    traverseAndIncrement(store, targetNodeId, 'increment');
}
function expand(store: StoreType, nodeId: string) {
  const targetNodeIds = findTargets(store, nodeId);
  for (const targetNodeId of targetNodeIds)
    traverseAndIncrement(store, targetNodeId, 'decrement');
}

export function toggleExpandAndCollapse(store: StoreType, nodeId: string) {
  const collapsibles = getCollapsibles(store, { nodeId: nodeId });
  if (collapsibles.length === 0) return; // when the collapsible feature is disabled, there will be no collapbsible objects
  if (collapsibles.length > 1)
    throw 'there should only be one collapsible object per node';
  const collapsible = collapsibles[0];
  if (collapsible.state === 'expanded') collapse(store, nodeId);
  else expand(store, nodeId);
  store.collapsibleStore.update((arr) => {
    for (const c of arr) if (c.id === collapsible.id) c.toggleState();
    return [...arr];
  });
}

export function getCollapsibles(
  store: StoreType,
  filter?: { [key: string]: any }
) {
  let collapsibles = Object.values(get(store.collapsibleStore));
  // filter the array of anchors for elements that match filter
  // Example: if filter = {sourceOrTarget: 'source', positionX: 35} then we will
  //return all anchors with sourceOrTarget = source AND poxitionX = 35
  if (filter !== undefined) {
    collapsibles = collapsibles.filter((collapsible) => {
      for (let filterKey in filter) {
        const filterValue = filter[filterKey];
        if (collapsible[filterKey as keyof CollapsibleType] !== filterValue)
          return false;
      }
      return true;
    });
  }
  // return list of anchors
  return collapsibles;
}
