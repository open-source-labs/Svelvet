import { ResizeNode } from '$lib/resizableNodes/models/ResizeNode';
import { Node } from '$lib/nodes/models/Node';
import { v4 as uuidv4 } from 'uuid';
import {
  createStoreEmpty,
  populateSvelvetStoreFromUserInput,
  findStore,
} from '$lib/store/controllers/storeApi';
import { sanitizeUserNodesAndEdges } from '$lib/container/controllers/middleware';
import type { UserNodeType, UserEdgeType } from '$lib/store/types/types';
import { populateAnchorsStore } from '$lib/store/controllers/util';

describe('tests node', () => {
  const canvasId = uuidv4();
  const initialNodes: UserNodeType[] = [
    {
      id: '1',
      position: { x: 225, y: 10 },
      data: { label: 'Add Images!' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      image: true,
      src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg',
    },
    {
      id: '2',
      position: { x: 390, y: 180 },
      data: { label: 'Mixed Anchors' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left',
    },
    {
      id: '3',
      position: { x: 225, y: 260 },
      data: { label: 'Output Node' },
      width: 100,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
    }
  ];

  const initialEdges: UserEdgeType[] = [
    { id: 'e1-2', source: '1', target: '2', label: 'edge label' },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animate: true,
      label: 'animated edges',
    },
    {
      id: 'e3-1',
      source: '3',
      target: '1',
      type: 'step',
      animate: true,
      edgeColor: '#FF4121',
    }
  ];
  //cosnt store =  invoke createEmptyStore?
  const store = createStoreEmpty(canvasId);
  //Santize input example in svelvet.svelte
  let output = sanitizeUserNodesAndEdges(initialNodes, initialEdges);
  const userNodes = output['userNodes'];
  const userEdges = output['userEdges'];

  // set canvas related stores. you need to do this before setting node/edge related stores
  // initializing nodes/edges might read relevant options from the store.
  store.widthStore.set(600);
  store.heightStore.set(600);
  store.backgroundStore.set(false);
  store.movementStore.set(true);
  const optionsObj = { snap: false, snapTo: 30 };
  store.options.set(optionsObj);
  store.nodeCreate.set(false);

  // set node/edge related stores
  //create store from user input
  //take the output and feed it to create storeformuserinput
  populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);

  const { nodesStore, anchorsStore, edgesStore} = store;

  // console.log('NODESTORE :', nodesStore)
  // nodesStore.update((node) => {
  //   console.log('NODE:', node)
  //   for (const nodeId in node) {
  //     console.log('NODEID:', node[nodeId]);
  //   }
  // });
test('set position from movement should update position X & Y based on mouse movement', () => {
  nodesStore.update((nodes) => {
    for (const nodeId in nodes) {
      if(nodeId === '1') {
        nodes[nodeId].setPositionFromMovement(10, 10);
        expect(nodes[nodeId].positionX).toBe(235)
        expect(nodes[nodeId].positionY).toBe(20)
      }
      if(nodeId === '2') {
        nodes[nodeId].setPositionFromMovement(-10, 10);
        expect(nodes[nodeId].positionX).toBe(380)
        expect(nodes[nodeId].positionY).toBe(190)
      }
      if(nodeId === '3') {
        nodes[nodeId].setPositionFromMovement(-10, -10);
        expect(nodes[nodeId].positionX).toBe(215)
        expect(nodes[nodeId].positionY).toBe(250)
      }
      // when setPositionsFromMovement runs it should cascade to the anchors edges and resizenode
    }
    return {...nodes}
  });
})
test('setSizeFromMovement should update the height and width of the node when resizes the Node by dragging at the right bottom corner (where the ResizedNode attached), reflect the changes in real time in the nodesStore, and also cascade the changes to all relative elements like Anchors and potential Anchors', () => {
  nodesStore.update((nodes) => {
    for (const nodeId in nodes) {
      if(nodeId === '1') {
        nodes[nodeId].setSizeFromMovement(10, 10);
        expect(nodes[nodeId].width).toBe(110);
        expect(nodes[nodeId].height).toBe(110);

        anchorsStore.update((anchors) => {
          for (const anchorId in anchors) {
            if(anchors[anchorId].nodeId === '1' && anchors[anchorId].sourceOrTarget === 'target') {
              expect(anchors[anchorId].positionX).toEqual(290);
              expect(anchors[anchorId].positionY).toEqual(130);
            } else if(anchors[anchorId].nodeId === '1' && anchors[anchorId].sourceOrTarget === 'source') {
              expect(anchors[anchorId].positionX).toEqual(345);
              expect(anchors[anchorId].positionY).toEqual(75);
            }
          }
          return {...anchors}
        })
    } else if(nodeId === '2') {
        nodes[nodeId].setSizeFromMovement(10, 10);
        expect(nodes[nodeId].width).toBe(135);
        expect(nodes[nodeId].height).toBe(50);

        anchorsStore.update((anchors) => {
          for (const anchorId in anchors) {
            if(anchors[anchorId].nodeId === '2' && anchors[anchorId].sourceOrTarget === 'target') {
              console.log(anchors[anchorId].positionX, anchors[anchorId].positionY)
            } else if(anchors[anchorId].nodeId === '2' && anchors[anchorId].sourceOrTarget === 'source') {
              console.log(anchors[anchorId].positionX, anchors[anchorId].positionY)
            }
          }
          return {...anchors}
        })
    } 
  }
  return {...nodes}
})
})
  //Then, call set PositionAndCascade on resizeNode and make sure the width/height of the node also changes.
  //Make sure when you call delete on the node that the resizeNode also disappears.
});
