/*
This file contains "middleware" functions that sanitize user input (UserNodeType and UserEdgeType). Put functions that 
maintain consistency between previous 

*/

import {
  bottomCb,
  leftCb,
  rightCb,
  topCb,
} from '$lib/edges/controllers/anchorCbUser';
import type { UserEdgeType, UserNodeType } from '$lib/store/types/types';

export function sanitizeUserNodesAndEdges(
  userNodes: UserNodeType[],
  userEdges: UserEdgeType[]
) {
  convertIdToString(userNodes);
  convertEdgeIdsToString(userEdges);
  convertAnchorPositionsToCallbacks(userNodes, userEdges);
  return { userNodes, userEdges };
}

// convertAnchorPositionsToCallbacks
// WHY:
// This function is in order to maintain compliance with earlier versions of Svelvet
// HISTORY:
// In Svelvet<=5, anchor points were hard-coded onto each node. Each node had a "sourcePosition"
// "targetPosition" where the edges would be attached. In Svelvet6, the store was re-designed
// from the ground up into an object-relational data model where anchor points could be attached
// at any point on the node using callbacks. This enabled features such as custom edge position,
// adaptive edge positioning, and dynamic edges.
// The purpose of this function is to parse the old way of specifying edge positions (as two source/target
// anchors on the node) into the Svelvet6 (where anchors are separate objects) in order to maintain a
// consistent user experience. However, we suggest that this functionality (parsing Svelvet5 syntax into
// Svelvet6 syntax) be removed completely in favor of only using Svelvet6 syntax in order to reduce edge cases
function convertAnchorPositionsToCallbacks(
  userNodes: UserNodeType[],
  userEdges: UserEdgeType[]
) {
  // convert userNodes array into object for constant time lookup by id
  const userNodesObj: { [key: string]: UserNodeType } = {};
  for (let userNode of userNodes) userNodesObj[userNode.id] = userNode;

  // iterate through userEdges, and check the source/target nodes.
  for (let userEdge of userEdges) {
    const userNodeSource = userNodesObj[userEdge.source];
    const userNodeTarget = userNodesObj[userEdge.target];
    const sourcePosition = userNodeSource.sourcePosition;
    const targetPosition = userNodeTarget.targetPosition;

    const cbs = { left: leftCb, right: rightCb, top: topCb, bottom: bottomCb };
    if (sourcePosition) userEdge.sourceAnchorCb = cbs[sourcePosition];
    if (targetPosition) userEdge.targetAnchorCb = cbs[targetPosition];
  }
}

// Converts node id's to strings. For Svelvet<6, node id's were numbers. These were switched to strings
// for compatibility with uuid.
function convertIdToString(userNodes: UserNodeType[]) {
  userNodes = userNodes.map((node) => {
    node.id = node.id.toString();
    node.childNodes =
      node.childNodes === undefined
        ? []
        : node.childNodes.map((childId) => childId.toString());
    return node;
  });
}

// Converts source/target node id's to string. For Svelvet<6, id's were numbers. These were switched to strings
// for compatibility with uuid.
function convertEdgeIdsToString(userEdges: UserEdgeType[]) {
  userEdges = userEdges.map((edge) => {
    edge.source = edge.source.toString();
    edge.target = edge.target.toString();
    return edge;
  });
}
