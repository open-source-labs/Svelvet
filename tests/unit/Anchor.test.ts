import { v4 as uuidv4 } from 'uuid';
import {
  createStoreEmpty,
  populateSvelvetStoreFromUserInput,
} from '$lib/store/controllers/storeApi';
import { sanitizeUserNodesAndEdges } from '$lib/container/controllers/middleware';
import type { UserNodeType, UserEdgeType } from '$lib/types/types';
import {
  rightCb,
  leftCb,
  topCb,
  bottomCb,
} from '$lib/edges/controllers/anchorCbUser';

//Only necessary if we need to reset the DOM after each test.
// afterEach(cleanup);

describe('tests Anchor', () => {
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
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      label: 'edge label',
      sourceAnchorCb: topCb,
      targetAnchorCb: leftCb,
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animate: true,
      label: 'animated edges',
      sourceAnchorCb: bottomCb,
      targetAnchorCb: rightCb,
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      type: 'step',
      animate: true,
      edgeColor: '#FF4121',
      sourceAnchorCb: bottomCb,
      targetAnchorCb: topCb,
    },
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

  const { anchorsStore, edgesStore } = store;

  //current train of thought is to use if statements to check if this is a source or target, based on that we can call callback and know what we should expect.
  // Iteration is in order... e1-2 source, => target and so on.

  test("tests that setPositionFromNode is changing the anchor's position accordingly", () => {
    anchorsStore.update((anchor) => {
      for (const id in anchor) {
        if (
          anchor[id].sourceOrTarget === 'target' &&
          anchor[id].edgeId === 'e1-2'
        ) {
          expect(anchor[id].positionX).toEqual(390);
          expect(anchor[id].positionY).toEqual(200);
        } else if (
          anchor[id].sourceOrTarget === 'source' &&
          anchor[id].edgeId === 'e1-2'
        ) {
          expect(anchor[id].positionX).toEqual(275);
          expect(anchor[id].positionY).toEqual(10);
        } else if (
          anchor[id].sourceOrTarget === 'source' &&
          anchor[id].edgeId === 'e2-3'
        ) {
          expect(anchor[id].positionX).toEqual(452.5);
          expect(anchor[id].positionY).toEqual(220);
        } else if (
          anchor[id].sourceOrTarget === 'target' &&
          anchor[id].edgeId === 'e2-3'
        ) {
          expect(anchor[id].positionX).toEqual(325);
          expect(anchor[id].positionY).toEqual(280);
        }
      }
      return {};
    });
  });

  test('should update edgesStore position X and Y when setPositionFromNode is called', () => {
    populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);

    anchorsStore.update((anchor) => {
      for (const id in anchor) {
        if (
          anchor[id].sourceOrTarget === 'target' &&
          anchor[id].edgeId === 'e1-2'
        ) {
          edgesStore.update((edge) => {
            expect(edge['e1-2'].targetX).toEqual(390);
            expect(edge['e1-2'].targetY).toEqual(200);
            return { ...edge };
          });
        } else if (
          anchor[id].sourceOrTarget === 'source' &&
          anchor[id].edgeId === 'e1-2'
        ) {
          edgesStore.update((edge) => {
            expect(edge['e1-2'].sourceX).toEqual(275);
            expect(edge['e1-2'].sourceY).toEqual(10);
            return { ...edge };
          });
        } else if (
          anchor[id].sourceOrTarget === 'source' &&
          anchor[id].edgeId === 'e2-3'
        ) {
          edgesStore.update((edge) => {
            expect(edge['e2-3'].sourceX).toEqual(452.5);
            expect(edge['e2-3'].sourceY).toEqual(220);
            return { ...edge };
          });
        } else if (
          anchor[id].sourceOrTarget === 'target' &&
          anchor[id].edgeId === 'e2-3'
        ) {
          edgesStore.update((edge) => {
            expect(edge['e2-3'].targetX).toEqual(325);
            expect(edge['e2-3'].targetY).toEqual(280);
            return { ...edge };
          });
        }
      }
      return {};
    });
  });
});
