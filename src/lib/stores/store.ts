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
  onTouchMove: (e: any, nodeID: number) => void;
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
    nodeSelected: writable(false),
    nodeIdSelected: writable(-1)
  };

  // update position of selected node
  const onMouseMove = (e: any, nodeID: number) => {
    coreSvelvetStore.nodesStore.update((n) => {
      n.forEach((node: Node) => {
        if (node.id === nodeID) {
          //console.log(`node.position.x --> ${node.position.x}`)
          node.position.x += e.movementX;
          node.position.y += e.movementY;
        }
      });
      return [...n];
    });
  };
  const onTouchMove = (e: any, nodeID: number) => {
    coreSvelvetStore.nodesStore.update((n) => {
      n.forEach((node: Node) => {
        if(node.id === nodeID) {
          // Not working perfectly, concerned about performance of getBoundingClientRect
          // maybe call tweening to smooth node movement?
          // const bcr = e.target.getBoundingClientRect();
          // const x = e.changedTouches[0].pageX - bcr.x;
          // const y = e.changedTouches[0].pageY - bcr.y;
          // if(x > 1 || x < -1 || y > 1 || y < -1){
          //   node.position.x += x - (node.width / 2);
          //   node.position.y += y - (node.height / 2);
          // } else {
          // node.position.x += x;
          // node.position.y += y;
          // }
          /* THIS ONE CREATES AN OFFSET
          // const bcr = e.target.getBoundingClientRect();
          // const x = e.changedTouches[0].pageX - bcr.x;
          // const y = e.changedTouches[0].pageY - bcr.y;
          // node.position.x += x;
          // node.position.y += y;
          */

          // currently working but much more verbose, NEEDS TO BE REMOVED BEFORE PRODUCTION!!!!!
          const {x, y, width, height} = e.target.getBoundingClientRect();
          const offsetX = (e.touches[0].clientX-x)/width*e.target.offsetWidth;
          const offsetY = (e.touches[0].clientY-y)/height*e.target.offsetHeight;
          console.log('offSetX-->', offsetX, 'offSetY-->', offsetY)
          if(offsetX > 1 || offsetX < -1 || offsetY > 1 || offsetY < -1){
            node.position.x += offsetX - (node.width / 2);
            node.position.y += offsetY - (node.height / 2);
          } else {
          node.position.x += offsetX;
          node.position.y += offsetY;
          } 
        }
      });
      return [...n];
    });
  };
  const nodeIdSelected = coreSvelvetStore.nodeIdSelected;
  const onNodeClick = (e: any, nodeID: number) => {
    get(nodesStore).forEach((node) => {
            if (node.id === get(nodeIdSelected)) {
                node.clickCallback?.(node)
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
    onTouchMove,
    onMouseMove,
    onNodeClick,
    derivedEdges
  };

  svelvetStores[key] = svelvetStore;
  return svelvetStore;
}
