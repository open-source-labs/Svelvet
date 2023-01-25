// implement functionality to hard-edit store values here

import { findStore, getNodeById } from "./storeApi"

/**
 * @function deleteNode 
 * @description This function will 
 * @param nodeId 
 * @param canvasId 
 */

export function deleteNode(nodeId, canvasId) {
  console.log('deleteNode fired!')
  const store = findStore(canvasId);
  const node = getNodeById(store, nodeId);
  console.log(node);
  node.delete()
}