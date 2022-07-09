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
  //TODO try changing the movement functionality to match touch event functionality to fix the unresponsiveness of node movement on mouse movement
  const onMouseMove = (e: any, nodeID: number) => {
    coreSvelvetStore.nodesStore.update((n) => {
      n.forEach((node: Node) => {
        if (node.id === nodeID) {
          console.log(`node.position.x --> ${e.movementX}`)
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
          //console.log('offSetX-->', offsetX, 'offSetY-->', offsetY)
          if(offsetX > 1 || offsetX < -1 || offsetY > 1 || offsetY < -1){
            //this is upset because I removed the require from the Node types
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
      //console.log('node',node.sourcePosition);
        if (edge.source === node.id) sourceNode = node;
        if (edge.target === node.id) {
          //console.log('edge.target-->', edge.target)
          targetNode = node
        };
      });
      //
      if (sourceNode) {
        //console.log('sourceNode.sourcePosition is...', sourceNode.sourcePosition);
        if (sourceNode.sourcePosition === 'top'){
          //console.log('top source was registered')
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          let middle = sourceNode.width / 2;
          edge.sourceX = left + middle
          edge.sourceY = top
          edge.sourcePosition = sourceNode.sourcePosition;
        }
        // if (sourceNode.sourcePosition === 'bottom'){
        //   console.log('bottom source was registered')
        //   let left = sourceNode.position.x;
        //   let top = sourceNode.position.y;        
        //   let middle = sourceNode.width / 2;      
        //   edge.sourceX = left + middle;            
        //   edge.sourceY = top + sourceNode.height;
        // }
        else if (sourceNode.sourcePosition === 'left'){
          //console.log('left source was registered')
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          let middle = sourceNode.width / 2;
          edge.sourceX = left
          edge.sourceY = top + sourceNode.height/2;
          edge.sourcePosition = sourceNode.sourcePosition;

        }
        else if (sourceNode.sourcePosition === 'right'){
          //console.log('right source was registered')
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          let middle = sourceNode.width / 2;
          edge.sourceX = left + sourceNode.width
          edge.sourceY = top + sourceNode.height/2
          edge.sourcePosition = sourceNode.sourcePosition;

        }
        //Default sourcePosition to bottom if sourcePosition not defined
        else if (sourceNode.sourcePosition === 'bottom' || sourceNode.sourcePosition === undefined) {
          let left = sourceNode.position.x;
          let top = sourceNode.position.y;
          let middle = sourceNode.width / 2;
          edge.sourceX = left + middle;
          edge.sourceY = top + sourceNode.height;
          edge.sourcePosition = 'bottom';
        }
      }
      if (targetNode) {
        //console.log('targetNode.targetPosition is...', targetNode.targetPosition);
        // if (targetNode.targetPosition === 'top'){
        //   console.log('top target was registered')
        //   let left = sourceNode.position.x;
        //   let top = sourceNode.position.y;
        //   let middle = sourceNode.width / 2;
        //   edge.sourceX = left + middle
        //   edge.sourceY = top
        // }
        if (targetNode.targetPosition === 'bottom'){
          //console.log('bottom target was registered')
          let left = targetNode.position.x;
          let top = targetNode.position.y;        
          let middle = targetNode.width / 2;      
          edge.targetX = left + middle;            
          edge.targetY = top + targetNode.height;
          edge.targetPosition = targetNode.targetPosition;

        }
        else if (targetNode.targetPosition === 'left'){
          //console.log(targetNode.targetPosition,  'left target was registered')
          //console.log(`${sourceNode.sourcePosition}`, 'should throw error, sourceNode.sourcePosition');
          let left = targetNode.position.x;
          let top = targetNode.position.y;
          let middle = targetNode.width / 2;
          edge.targetX = left
          edge.targetY = top + targetNode.height/2
          edge.targetPosition = targetNode.targetPosition;
          //console.log('edge.targetX')
        }
        else if (targetNode.targetPosition === 'right'){
          //console.log('right target was registered')
          let left = targetNode.position.x;
          let top = targetNode.position.y;
          let middle = targetNode.width / 2;
          edge.targetX = left + targetNode.width
          edge.targetY = top + targetNode.height/2
          edge.targetPosition = targetNode.targetPosition;
          
        }
        //Default to top targetPosition no targetPosition defined
        else if (targetNode.targetPosition === 'top' || targetNode.targetPosition === undefined) {
          let left = targetNode.position.x;
         let top = targetNode.position.y;
         let middle = targetNode.width / 2;
          edge.targetX = left + middle;
         edge.targetY = top;
         edge.targetPosition = 'top';
        }
      }
      // if (sourceNode) {
      //   let left = sourceNode.position.x;
      //   let top = sourceNode.position.y;
      //   let middle = sourceNode.width / 2;
      //   edge.sourceX = left + middle;
      //   edge.sourceY = top + sourceNode.height;
      // }
      // if (targetNode) {
      //   let left = targetNode.position.x;
      //   let top = targetNode.position.y;
      //   let middle = targetNode.width / 2;
      //   edge.targetX = left + middle;
      //   edge.targetY = top;
      // }
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
