import { writable, derived, get, readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { Node, Edge, DerivedEdge } from '../types/types';

export interface NodeProps {
  idNumber: Writable<number>;
  positionX: Writable<number>;
  positionY: Writable<number>;
  data: Writable<string>;
  width: Writable<number>;
  height: Writable<number>;
  borderColor: Writable<string>;
  borderRadius: Writable<number>;
  bgColor: Writable<string>;
  textColor: Writable<string>;
}

export const nodeProps: NodeProps = {
  idNumber: writable('7'),
  positionX: writable(),
  positionY: writable(),
  data: writable(''),
  width: writable(),
  height: writable(),
  borderColor: writable(),
  borderRadius: writable(''),
  bgColor: writable(''),
  textColor: writable('')
};

//variables to update from modal
export let idNumber = nodeProps.idNumber;
export let data = nodeProps.data;
export let positionX = nodeProps.positionX;
export let positionY = nodeProps.positionY;
export let width = nodeProps.width;
export let height = nodeProps.height;
export let borderColor = nodeProps.borderColor;
export let borderRadius = nodeProps.borderRadius;
export let bgColor = nodeProps.bgColor;
export let textColor = nodeProps.textColor;
//toggle modal form
export interface ToggleBools {
  inputToggle: Writable<boolean>;
  buildToggle: Writable<boolean>;
}
export const toggleBools: ToggleBools = {
  inputToggle: writable(false),
  buildToggle: writable(false)
};
export let inputToggle = toggleBools.inputToggle;
//build toggle for activating functionality in code mirror
export let buildToggle = toggleBools.buildToggle;

// // new node creation to insert in between pt 1 and 2 on code mirror text editor
// export interface NEWNODE  {newNode: Writable <string>;}
// export let buildNode: NEWNODE = {newNode: writable(`{
//   id: ${idNumber},
//   position: { x:${positionX}, y:${positionY}},
//   data: { label: "${data}" },
//   width: ${width},
//   height: ${height},
//   borderColor: "${borderColor}",
//   borderRadius: ${borderRadius},
//   bgColor: "${bgColor}",
//   textColor: "${textColor}"
// },`) }
// export let newNode = buildNode.newNode;
// export const newNode = derived(
//   nodeProps.idNumber,
//   $newNode => {
//     `{
//       id: ${nodeProps.idNumber},
//       position: { x:${positionX}, y:${nodeProps.positionY}},
//       data: { label: "${nodeProps.data}" },
//       width: ${nodeProps.width},
//       height: ${nodeProps.height},
//       borderColor: "${nodeProps.borderColor}",
//       borderRadius: ${nodeProps.borderRadius},
//       bgColor: "${nodeProps.bgColor}",
//       textColor: "${nodeProps.textColor}"
//     },`
//   }
// )

//code mirror default code part 1
export const editStrP1 = writable(`<script>
import Svelvet from 'svelvet';
const initialNodes = [
  {
    id: 1,
    position: { x: 225, y: 10 },
    data: { label: 'Add Images!' },
    width: 100,
    height: 100,
    bgColor: 'white',
    borderColor: 'transparent',
    image: true,
    src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg'
  },
  {
    id: 2,
    position: { x: 390, y: 180 },
    data: { label: 'Mixed Anchors' },
    width: 125,
    height: 40,
    bgColor: 'white',
    targetPosition: 'left'
  },
  {
    id: 3,
    position: { x: 225, y: 260 },
    data: { label: 'Output Node' },
    width: 100,
    height: 40,
    bgColor: '#FFE4E6'
  },
  {
    id: 4,
    position: { x: 25, y: 180 },
    data: { label: 'Drag me!' },
    width: 125,
    height: 40,
    bgColor: 'white',
    targetPosition: 'right'
  },
  {
    id: 5,
    position: { x: 390, y: 380 },
    data: { label: 'Custom Node' },
    width: 125,
    height: 40,
    bgColor: '#C8FFC7',
    borderColor: 'transparent',
    borderRadius: 0
  },
  {
    id: 6,
    position: { x: 47.5, y: 360 },
    data: { label: 'Custom Node' },
    width: 80,
    height: 80,
    borderColor: '#FF4121',
    borderRadius: 30,
    bgColor: 'white',
    textColor: '#FF4121'
  },`);
//code mirror default code part 2
export const editStrP2 = `];

const initialEdges = [
{ id: 'e1-2', source: 1, target: 2, label: 'edge label' },
{ id: 'e2-3', source: 2, target: 3, animate: true, label: 'animated edges' },
{ id: 'e1-4', source: 1, target: 4, type: 'step', animate: true, edgeColor: '#FF4121' },
{ id: 'e2-5', source: 2, target: 5, label: 'colored edges', animate: true, arrow: true, edgeColor: '#FF4121', labelBgColor: '#1F2937', labelTextColor: '#FFE4E6' },
{ id: 'e2-5', source: 4, target: 6, type: 'straight' },
{ id: 'e2-5', source: 3, target: 6, type: 'smoothstep', label: 'colored label', labelBgColor: '#FF4561', labelTextColor: 'white', animate: true }
];
</\script>

<Svelvet nodes={initialNodes} edges={initialEdges} width={710} height={700} background />
  `;
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
  const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
    $edgesStore.forEach((edge: any) => {
      // any -> edge should follow type DerivedEdge, but we are assigning to any so the typing meshes together

      // These are dummy nodes to resolve a typescripting issue. They are overwritten in the following forEach loop
      let sourceNode: Node = {
        id: 0,
        position: { x: 25, y: 475 },
        data: { label: '9' },
        width: 175,
        height: 40,
        targetPosition: 'right',
        sourcePosition: 'left'
      };

      let targetNode: Node = {
        id: 10,
        position: { x: 750, y: 475 },
        data: { label: '10' },
        width: 175,
        height: 40,
        targetPosition: 'right',
        sourcePosition: 'left'
      };

      $nodesStore.forEach((node: Node) => {
        if (edge.source === node.id) sourceNode = node;
        if (edge.target === node.id) targetNode = node;
      });

      if (sourceNode) {
        //left side of the node selected
        let left = sourceNode.position.x;
        //top of the node selected
        let top = sourceNode.position.y;
        //declaring the middle point of the node
        let middle = sourceNode.width / 2;

        //Default sourcePosition to bottom if sourcePosition not defined
        if (sourceNode.sourcePosition === 'bottom' || sourceNode.sourcePosition === undefined) {
          //the x coordinate of the middle of the node
          edge.sourceX = left + middle;
          //the y coordinate of the bottom of the node
          edge.sourceY = top + sourceNode.height;
          //assign sourcePosition to the edge for usage in the various edge components
          edge.sourcePosition = 'bottom';
        } else if (sourceNode.sourcePosition === 'top') {
          edge.sourceX = left + middle;
          edge.sourceY = top;
          edge.sourcePosition = sourceNode.sourcePosition;
        } else if (sourceNode.sourcePosition === 'left') {
          edge.sourceX = left;
          edge.sourceY = top + sourceNode.height / 2;
          edge.sourcePosition = sourceNode.sourcePosition;
        } else if (sourceNode.sourcePosition === 'right') {
          edge.sourceX = left + sourceNode.width;
          edge.sourceY = top + sourceNode.height / 2;
          edge.sourcePosition = sourceNode.sourcePosition;
        }
      }
      if (targetNode) {
        //left side of the node selected
        let left = targetNode.position.x;
        //top of the node selected
        let top = targetNode.position.y;
        //declaring the middle point of the node
        let middle = targetNode.width / 2;

        //Default to top targetPosition if targetPosition undefined
        if (targetNode.targetPosition === 'top' || targetNode.targetPosition === undefined) {
          //the x coordinate of the middle of the node
          edge.targetX = left + middle;
          //the y coordinate of the bottom of the node
          edge.targetY = top;
          //assign sourcePosition to the edge for usage in the various edge components
          edge.targetPosition = 'top';
        } else if (targetNode.targetPosition === 'bottom') {
          edge.targetX = left + middle;
          edge.targetY = top + targetNode.height;
          edge.targetPosition = targetNode.targetPosition;
        } else if (targetNode.targetPosition === 'left') {
          edge.targetX = left;
          edge.targetY = top + targetNode.height / 2;
          edge.targetPosition = targetNode.targetPosition;
        } else if (targetNode.targetPosition === 'right') {
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
