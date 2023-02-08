import SmoothStepEdge from '$lib/edges/views/Edges/SmoothStepEdge.svelte';
import { render, screen, cleanup } from '@testing-library/svelte';

import { v4 as uuidv4 } from 'uuid';
import {
  createStoreEmpty,
  populateSvelvetStoreFromUserInput,
} from '$lib/store/controllers/storeApi';

import { getEdgeById } from '$lib/edges/controllers/util';

import { sanitizeUserNodesAndEdges } from '$lib/container/controllers/middleware';
import type { UserNodeType, UserEdgeType } from '$lib/store/types/types';

afterEach(() => cleanup());

describe('tests SmoothStepEdge', () => {
  const canvasId = uuidv4();
  const initialNodes: UserNodeType[] = [
    {
      id: '1',
      position: { x: 50, y: 50 },
      data: { label: 'id-1' },
      width: 100,
      height: 50,
      bgColor: 'white',
      sourcePosition: 'bottom',
    },
    {
      id: '2',
      position: { x: 150, y: 200 },
      data: { label: 'id-2' },
      width: 100,
      height: 50,
      bgColor: 'white',
      targetPosition: 'top',
    },
    {
      id: '3',
      position: { x: 50, y: 50 },
      data: { label: 'id-3' },
      width: 100,
      height: 50,
      bgColor: 'white',
      sourcePosition: 'right',
    },
    {
      id: '4',
      position: { x: 150, y: 200 },
      data: { label: 'id-4' },
      width: 100,
      height: 50,
      bgColor: 'white',
      targetPosition: 'left',
    },
  ];

  const initialEdges: UserEdgeType[] = [
    {
      id: 'bottom_top',
      source: '1',
      target: '2',
      type: 'smoothstep',
      label: 'this is the test edge',
    },
    {
      id: 'right_left',
      source: '3',
      target: '4',
      type: 'smoothstep',
      label: 'this is the test edge',
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

  test('should calculate the correct smooth step path string from bottom to top', () => {
    render(SmoothStepEdge, {
      props: { edge: getEdgeById(store, 'bottom_top'), canvasId },
    });
    const pathElement = screen.getByLabelText('svg-path');
    expect(pathElement).toHaveAttribute(
      'd',
      'M 100,100L 100,145Q 100,150 105,150L 195,150Q 200,150 200,155L 200,200'
    );
  });

  test('should calculate the correct smooth step path string from right to left', () => {
    render(SmoothStepEdge, {
      props: { edge: getEdgeById(store, 'right_left'), canvasId },
    });
    const pathElement = screen.getByLabelText('svg-path');

    expect(pathElement).toHaveAttribute(
      'd',
      'M 150,75L 150,75Q 150,75 150,75L 150,225Q 150,225 150,225L 150,225'
    );
  });
});
