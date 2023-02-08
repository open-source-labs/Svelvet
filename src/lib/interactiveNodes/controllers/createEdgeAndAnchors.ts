import { v4 as uuidv4 } from 'uuid';
import type { StoreType, PotentialAnchorType } from '../../store/types/types';
import { get } from 'svelte/store';
import { Node } from '../../nodes/models/Node';
import { Edge } from '../../edges/models/Edge';
import { Anchor } from '../../edges/models/Anchor';

import {
  rightCb,
  leftCb,
  topCb,
  bottomCb,
} from '../../edges/controllers/anchorCbUser';
import { createPotentialAnchor } from '../../store/controllers/util';
import { dynamicCbCreator } from '../../edges/controllers/anchorCbDev';
import { getAnchors } from '../../edges/controllers/util';
import { getPotentialAnchors } from './util';

/**
 * Creates a new edge and two adaptive anchor points and updates the edgesStore and anchorsStore.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param sourceNodeId The id of the source Node
 * @param targetNodeId The id of the target Node
 * @param canvasId The canvasId of a Svelvet component
 */
export function createEdgeAndAnchors(
  store: StoreType,
  sourceNodeId: string,
  targetNodeId: string,
  canvasId: string
) {
  // create an edge
  const edgeId = uuidv4();
  const newEdge = new Edge(
    edgeId,
    -1,
    -1,
    -1,
    -1,
    canvasId,
    '',
    'bezier',
    'black',
    'black',
    'black',
    false,
    true,
    false,
    () => {},
    ''
  );

  // create source anchor
  const sourceAnchorId = uuidv4();
  const sourceDynamicCb = dynamicCbCreator(store, edgeId, sourceAnchorId);
  const sourceAnchor = new Anchor(
    sourceAnchorId,
    sourceNodeId,
    edgeId,
    'source',
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    sourceDynamicCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
  );

  // create target anchor
  const targetAnchorId = uuidv4();
  const targetDynamicCb = dynamicCbCreator(store, edgeId, targetAnchorId);
  const targetAnchor = new Anchor(
    targetAnchorId,
    targetNodeId,
    edgeId,
    'target',
    -1, // dummy variables for x,y,angle for now
    -1, // dummy variables for x,y,angle for now
    targetDynamicCb,
    canvasId,
    0 // dummy variables for x,y,angle for now
  );

  // put everything into the store
  const { edgesStore, anchorsStore } = store;

  anchorsStore.update((anchors) => {
    anchors[sourceAnchorId] = sourceAnchor;
    anchors[targetAnchorId] = targetAnchor;
    return { ...anchors };
  });
  edgesStore.update((edges) => {
    edges[edgeId] = newEdge;
    return { ...edges };
  });

  // make sure to update positions. TODO: don't need to do this for the entire store
  const anchors = getAnchors(store);
  for (const anchor of anchors) anchor.callback();
}
