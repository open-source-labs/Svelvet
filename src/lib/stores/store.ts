import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Node, DerivedEdge } from '../types/types';

// const defaultNode = {
// 	id: null,
// 	type: null,
// 	position: {x: 10, y: 10},
// 	width: 100px,
// 	height: 50px,
// 	backgroundColor: white,
// }

export const nodesStore: Writable<[]> = writable([]);
export const edgesStore: Writable<[]> = writable([]);
export const widthStore: Writable<number> = writable(600);
export const heightStore: Writable<number> = writable(600);
export const backgroundStore: Writable<boolean> = writable(false);

export const nodeSelected: Writable<boolean> = writable(false);

// update position of selected node
export const onMouseMove = (e: any, nodeID: number) => {
  nodesStore.update((n) => {
    n.forEach((node: Node) => {
      if (node.id === nodeID) {
        node.position.x += e.movementX;
        node.position.y += e.movementY;
      }
    });
    return [...n];
  });
};

// derive from nodesStore and edgesStore, pass in array value from each store
// updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
// $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
// so derivedEdges has access to node.position.x and node.position.y changes inside of this function
export const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
  $edgesStore.forEach((edge: DerivedEdge) => {
    let sourceNode: any; // should follow type Node
    let targetNode: any;
    $nodesStore.forEach((node: Node) => {
      if (edge.source === node.id) sourceNode = node;
      if (edge.target === node.id) targetNode = node;
    });
    if (sourceNode) {
      let left = sourceNode.position.x;
      let top = sourceNode.position.y;
      let middle = sourceNode.width / 2;
      edge.sourceX = left + middle;
      edge.sourceY = top + sourceNode.height;
    }
    if (targetNode) {
      let left = targetNode.position.x;
      let top = targetNode.position.y;
      let middle = targetNode.width / 2;
      edge.targetX = left + middle;
      edge.targetY = top;
    }
  });
  return [...$edgesStore];
});
