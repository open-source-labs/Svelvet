import { writable, derived, get } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { Node, Edge, DerivedEdge } from '../types/types';

interface CoreSvelvetStore {
  nodesStore: Writable<Node[]>;
  edgesStore: Writable<Edge[]>;
  widthStore: Writable<number>;
  heightStore: Writable<number>;
  backgroundStore: Writable<boolean>;
  nodeSelected: Writable<number>;
}

interface SvelvetStore extends CoreSvelvetStore {
  onMouseMove: (e: any, nodeID: number) => void;
  onNodeClick: (e: any, nodeID: number) => void;
  derivedEdges: Readable<Edge[]>;
}

const svelvetStores: { [key: string]: SvelvetStore } = {};

export function findOrCreateStore(key: string): SvelvetStore {
  const existing = svelvetStores[key];
  if (existing) {
    return existing;
  }

  const coreSvelvetStore: CoreSvelvetStore = {
    nodesStore: writable([]),
    edgesStore: writable([]),
    widthStore: writable(600),
    heightStore: writable(600),
    backgroundStore: writable(false),
    nodeSelected: writable(-1)
  };

  // update position of selected node
  const onMouseMove = (e: any, nodeID: number) => {
    coreSvelvetStore.nodesStore.update((n) => {
      n.forEach((node: Node) => {
        if (node.id === nodeID) {
          node.position.x += e.movementX;
          node.position.y += e.movementY;
        }
      });
      return [...n];
    });
  };
  const nodeSelected = coreSvelvetStore.nodeSelected;
  const onNodeClick = (e: any, nodeID: number) => {
    get(nodesStore).forEach((node) => {
            if (node.id === get(nodeSelected)) {
                node.clickCallback?.(node.id, node.data.label)
            }

    })
}
  const edgesStore = coreSvelvetStore.edgesStore;
  const nodesStore = coreSvelvetStore.nodesStore;

  // derive from nodesStore and edgesStore, pass in array value from each store
  // updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
  // $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
  // so derivedEdges has access to node.position.x and node.position.y changes inside of this function
  const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
    $edgesStore.forEach((edge: any) => {
      // any -> edge should follow type DerivedEdge, but we are assigning to a type Edge element so the typing meshes together
      let sourceNode: any; // any -> should follow type Node
      let targetNode: any; // any -> should follow type Node
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

  const svelvetStore = {
    ...coreSvelvetStore,
    onMouseMove,
    onNodeClick,
    derivedEdges
  };

  svelvetStores[key] = svelvetStore;
  return svelvetStore;
}
