import { render, cleanup } from '@testing-library/svelte';
import { v4 as uuidv4 } from 'uuid';
import {
  createStoreEmpty,
  populateSvelvetStoreFromUserInput,
} from '$lib/store/controllers/storeApi';
import { sanitizeUserNodesAndEdges } from '$lib/container/controllers/middleware';
import type { UserNodeType, UserEdgeType } from '$lib/types/types';

describe('tests ResizeNode', () => {
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
    },
    {
      id: '4',
      position: { x: 25, y: 180 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'right',
    },
    {
      id: '5',
      position: { x: 390, y: 380 },
      data: { label: 'Custom Node' },
      width: 125,
      height: 40,
      bgColor: 'green',
      textColor: 'black',
      borderColor: 'transparent',
      borderRadius: 0,
    },
    {
      id: '6',
      position: { x: 47.5, y: 360 },
      data: { label: 'Custom Node' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'grey',
      textColor: '#FF4121',
    },
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
      id: 'e1-4',
      source: '1',
      target: '4',
      type: 'step',
      animate: true,
      edgeColor: '#FF4121',
    },
    {
      id: 'e2-5',
      source: '2',
      target: '5',
      label: 'colored edges',
      animate: true,
      arrow: true,
      edgeColor: '#FF4121',
      labelBgColor: '#1F2937',
      labelTextColor: '#FFE4E6',
    },
    { id: 'e2-6', source: '4', target: '6', type: 'straight' },
    {
      id: 'e2-7',
      source: '3',
      target: '6',
      type: 'smoothstep',
      label: 'colored label',
      labelBgColor: '#FF4561',
      labelTextColor: 'white',
      animate: true,
    },
  ];
  //cosnt store =  invoke createEmptyStore?
  const store = createStoreEmpty(canvasId);
  //Santize input example in svelvet.svelte
  let output = sanitizeUserNodesAndEdges(initialNodes, initialEdges);
  const userNodes = output['userNodes'];
  const userEdges = output['userEdges'];

  // initializing nodes/edges might read relevant options from the store.
  store.widthStore.set(600);
  store.heightStore.set(600);
  store.backgroundStore.set(false);
  store.movementStore.set(true);
  const optionsObj = { snap: false, snapTo: 30 };
  store.options.set(optionsObj);
  store.nodeCreate.set(false);

  test('setPosition should update the position X & Y of resizeNode class', () => {
    //create store from user input
    populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);

    const { resizeNodesStore, nodesStore } = store;
    //update allows us to iterate through our store returning an item with each resizeNode
    resizeNodesStore.update((resizeNode) => {
      for (const id in resizeNode) {
        //if the current resizeNode has a reference to the nodeId of 1 test that setPosition
        //I used the nodeId because it was a static input number that won't change for the sake of the test
        //it is the same as the initialNodes id
        if (resizeNode[id].nodeId === '1') {
          resizeNode[id].setPosition(10, 10);
          expect(resizeNode[id].positionX).toEqual(335);
          expect(resizeNode[id].positionY).toEqual(120);
        } else if (resizeNode[id].nodeId === '2') {
          resizeNode[id].setPosition(-10, -10);
          expect(resizeNode[id].positionX).toEqual(505);
          expect(resizeNode[id].positionY).toEqual(210);
        } else if (resizeNode[id].nodeId === '3') {
          resizeNode[id].setPosition(0, 0);
          expect(resizeNode[id].positionX).toEqual(325);
          expect(resizeNode[id].positionY).toEqual(300);
        }
      }
      return {};
    });
  });

  //setPositionAndCascade is identical to setPosition except it also cascades changes to the nodes width and height.
  test('setPositionAndCascade should update position X & Y of resizeNode class & update node width & height', () => {
    populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);
    const { resizeNodesStore, nodesStore } = store;

    //iterate through resizeNode to invoke setPositionAndCascade
    resizeNodesStore.update((resizeNode) => {
      for (const id in resizeNode) {
        if (resizeNode[id].nodeId === '1') {
          resizeNode[id].setPositionAndCascade(10, 10);
          //once function runs iterate through nodes to check if changes to the corresponding node were applied.
          nodesStore.update((node) => {
            for (const nodeId in node) {
              if (nodeId === '1') {
                expect(node[nodeId].width).toEqual(110);
                expect(node[nodeId].height).toEqual(110);
              }
            }
            return { ...node };
          });
        } else if (resizeNode[id].nodeId === '2') {
          resizeNode[id].setPositionAndCascade(-10, -10);
          nodesStore.update((node) => {
            for (const nodeId in node) {
              if (nodeId === '2') {
                expect(node[nodeId].width).toEqual(115);
                expect(node[nodeId].height).toEqual(30);
              }
            }
            return { ...node };
          });
        } else if (resizeNode[id].nodeId === '3') {
          resizeNode[id].setPositionAndCascade(-320, 0);
          nodesStore.update((node) => {
            for (const nodeId in node) {
              if (nodeId === '3') {
                expect(node[nodeId].width).toEqual(100);
                expect(node[nodeId].height).toEqual(40);
              }
            }
            return { ...node };
          });
        }
      }
      return {};
    });
  });

  //Make sure when you call delete on the node that the resizeNode also disappears.
  test('delete function should remove the specific resizeNode object', () => {
    populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);
    const { resizeNodesStore, nodesStore } = store;

    resizeNodesStore.update((resizeNode) => {
      for (const id in resizeNode) {
        expect(resizeNode[id].delete()).toBeUndefined();
      }
      return {};
    });
  });
});
