import { writable, derived, get } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { Node, Edge, DerivedEdge } from '../types/types';

interface CoreSvelvetStore {
  nodesStore: Writable<Node[]>;
  edgesStore: Writable<Edge[]>;
  widthStore: Writable<number>;
  heightStore: Writable<number>;
  backgroundStore: Writable<boolean>;
  nodeIdSelected: Writable<number>;
  nodeSelected: Writable<boolean>;
}

interface SvelvetStore extends CoreSvelvetStore {
  onMouseMove: (e: any, nodeID: number) => void;
  onNodeClick: (e: any, nodeID: number) => void;
  derivedEdges: Readable<Edge[]>;
}

const svelvetStores: { [key: string]: SvelvetStore } = {};

// refer to svelvet/index, if key does not exist, then create one.
//Creates one svelvet with a key
export function findOrCreateStore(key: string): SvelvetStore {
  const existing = svelvetStores[key];
  if (existing) {
    return existing;
  }
  //Setting defaults of core svelvet store and making them a store using writable
  const coreSvelvetStore: CoreSvelvetStore = {
    nodesStore: writable([]),
    edgesStore: writable([]),
    widthStore: writable(600),
    heightStore: writable(600),
    backgroundStore: writable(false),
    nodeSelected: writable(false),
    nodeIdSelected: writable(-1)
  };

  // update position of selected node
  // ANSWER: controls node position based on x,y position and add that to node position so it can follow the mouse
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

  //ANSWER: has to do with click function, pull request has made it so when you click a node you can have a function that is invoked (clickCallback) and be able to tell which node is clicked
  const nodeIdSelected = coreSvelvetStore.nodeIdSelected;
  const onNodeClick = (e: any, nodeID: number) => {
    get(nodesStore).forEach((node) => {
      if (node.id === get(nodeIdSelected)) {
        node.clickCallback?.(node);
      }
    });
  };
  //ANSWER: setting edges and nodes for the store
  const edgesStore = coreSvelvetStore.edgesStore;
  const nodesStore = coreSvelvetStore.nodesStore;

  // derive from nodesStore and edgesStore, pass in array value from each store
  // updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
  // $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
  // so derivedEdges has access to node.position.x and node.position.y changes inside of this function

  //ANSWER: Taking the information and adding other properties such as x,y, target x and y, so that the edge has enough information to create the line. In order to create any edge we need starting point and ending point of each line. All we give to the edges array is a source and a target.
  const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
    $edgesStore.forEach((edge: any) => {
      // any -> edge should follow type DerivedEdge, but we are assigning to a type Edge element so the typing meshes together
      let sourceNode: any; // any -> should follow type Node
      let targetNode: any; // any -> should follow type Node
      $nodesStore.forEach((node: Node) => {
        if (edge.source === node.id) sourceNode = node;
        if (edge.target === node.id) targetNode = node;
      });
      //
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
  //Puts everything together as the svelvet store and use the key so that it can be used.
  const svelvetStore = {
    ...coreSvelvetStore,
    onMouseMove,
    onNodeClick,
    derivedEdges
  };

  svelvetStores[key] = svelvetStore;
  return svelvetStore;
}
