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
  d3Scale: Writable<number>;
}

interface SvelvetStore extends CoreSvelvetStore {
  onMouseMove: (e: any, nodeID: number) => void;
  onNodeClick: (e: any, nodeID: number) => void;
  onTouchMove: (e: any, nodeID: number) => void;
  derivedEdges: Readable<Edge[]>;
}

const svelvetStores: { [key: string]: SvelvetStore } = {};

// refer to Svelvet/index, if store does not exist, then create one.
// Creates one Svelvet component store using the unique key
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
    nodeIdSelected: writable(-1),
    d3Scale: writable(1)
  };

  // This is the function handler for the mouseMove event to update the position of the selected node.
  const onMouseMove = (e: any, nodeID: number) => {
    coreSvelvetStore.nodesStore.update((n) => {
      n.forEach((node: Node) => {
        if (node.id === nodeID) {
          //retrieve d3Scale value from store
          const scale = get(coreSvelvetStore.d3Scale);
          // divide the movement value by scale to keep it proportional to d3Zoom transformations
          node.position.x += e.movementX / scale;
          node.position.y += e.movementY / scale;
        }
      });
      return [...n];
    });
  };

  // This is the function handler for the touch event on mobile to select a node.
  const onTouchMove = (e: any, nodeID: number) => {
    coreSvelvetStore.nodesStore.update((n) => {
      n.forEach((node: Node) => {
        if (node.id === nodeID) {
          //calculates the location of the selected node
          const { x, y, width, height } = e.target.getBoundingClientRect();
          const offsetX = ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
          const offsetY = ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
          // centers the node consistently under the user's touch
          node.position.x += offsetX - node.width / 2;
          node.position.y += offsetY - node.height / 2;
        }
      });
      return [...n];
    });
  };
  const nodeIdSelected = coreSvelvetStore.nodeIdSelected;
  // if the user clicks a node without moving it, this function fires allowing a user to invoke the callback function
  const onNodeClick = (e: any, nodeID: number) => {
    get(nodesStore).forEach((node) => {
      if (node.id === get(nodeIdSelected)) {
        node.clickCallback?.(node);
      }
    });
  };

  const edgesStore = coreSvelvetStore.edgesStore;
  const nodesStore = coreSvelvetStore.nodesStore;

  // derive from nodesStore and edgesStore, pass in array value from each store
  // updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
  // $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
  // so derivedEdges has access to node.position.x and node.position.y changes inside of this function

  //ANSWER: Taking the information and adding other properties such as x,y, target x and y, so that the edge has enough information to create the line. In order to create any edge we need starting point and ending point of each line. All we give to the edges array is a source and a target.
  const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
    $edgesStore.forEach((edge: Edge) => {
      // any -> edge should follow type DerivedEdge, but we are assigning to a type Edge element so the typing meshes together
      let sourceNode: Node; // any -> should follow type Node
      let targetNode: Node; // any -> should follow type Node
      $nodesStore.forEach((node: Node) => {
        if (edge.source === node.id) sourceNode = node;
        if (edge.target === node.id) targetNode = node;
      });
      //
      if (sourceNode) {
        //Default sourcePosition to bottom if sourcePosition not defined
        if (sourceNode.sourcePosition === 'bottom' || sourceNode.sourcePosition === undefined) {
          //left side of the node selected
          let left = sourceNode.position.x;
          //top of the node selected
          let top = sourceNode.position.y;
          //declaring the middle point of the node
          let middle = sourceNode.width / 2;
          //the x coordinate of the middle of the node
          edge.sourceX = left + middle;
          //the y coordinate of the bottom of the node
          edge.sourceY = top + sourceNode.height;
          //assign sourcePosition to the edge for usage in the various edge components
          edge.sourcePosition = 'bottom';
        } else if (sourceNode.sourcePosition === 'top') {
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          let middle = sourceNode.width / 2;
          edge.sourceX = left + middle;
          edge.sourceY = top;
          edge.sourcePosition = sourceNode.sourcePosition;
        } else if (sourceNode.sourcePosition === 'left') {
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          edge.sourceX = left;
          edge.sourceY = top + sourceNode.height / 2;
          edge.sourcePosition = sourceNode.sourcePosition;
        } else if (sourceNode.sourcePosition === 'right') {
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          edge.sourceX = left + sourceNode.width;
          edge.sourceY = top + sourceNode.height / 2;
          edge.sourcePosition = sourceNode.sourcePosition;
        }
      }
      if (targetNode) {
        //Default to top targetPosition if targetPosition undefined
        if (targetNode.targetPosition === 'top' || targetNode.targetPosition === undefined) {
          //left side of the node selected
          let left = targetNode.position.x;
          //top of the node selected
          let top = targetNode.position.y;
          //declaring the middle point of the node
          let middle = targetNode.width / 2;
          //the x coordinate of the middle of the node
          edge.targetX = left + middle;
          //the y coordinate of the bottom of the node
          edge.targetY = top;
          //assign sourcePosition to the edge for usage in the various edge components
          edge.targetPosition = 'top';
        } else if (targetNode.targetPosition === 'bottom') {
          let left = targetNode.position.x;
          let top = targetNode.position.y;
          let middle = targetNode.width / 2;
          edge.targetX = left + middle;
          edge.targetY = top + targetNode.height;
          edge.targetPosition = targetNode.targetPosition;
        } else if (targetNode.targetPosition === 'left') {
          let left = targetNode.position.x;
          let top = targetNode.position.y;
          edge.targetX = left;
          edge.targetY = top + targetNode.height / 2;
          edge.targetPosition = targetNode.targetPosition;
        } else if (targetNode.targetPosition === 'right') {
          let left = targetNode.position.x;
          let top = targetNode.position.y;
          edge.targetX = left + targetNode.width;
          edge.targetY = top + targetNode.height / 2;
          edge.targetPosition = targetNode.targetPosition;
        }
      }
    });
    return [...$edgesStore];
  });
  //Puts everything together as the svelvet store and use the key so that it can be used.
  const svelvetStore = {
    ...coreSvelvetStore,
    onTouchMove,
    onMouseMove,
    onNodeClick,
    derivedEdges
  };

  svelvetStores[key] = svelvetStore;
  return svelvetStore;
}
