  //import BaseEdge from '$lib/Edges/BaseEdge.svelte';
  //import { Position } from '$lib/types/utils';
  //import { getCenter } from './utils';
  const Position = {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom'
  }

  // how to create a smooth, controlled beizer edge from source and target positions
  // referenced from ReactFlow.dev

  function getControl({ pos, x1, y1, x2, y2 }) {
    let ctX;
    let ctY;
    //TODO Check if other positions are working
    switch (pos) {
      case Position.Left:
      case Position.Right:
        {
          ctX = 0.5 * (x1 + x2);
          ctY = y1;
        }
        break;
      case Position.Top:
      case Position.Bottom:
        {
          ctX = x1;
          ctY = 0.5 * (y1 + y2);
        }
        break;
    }
    return [ctX, ctY];
  }

  // returns string to pass into edge 'path' svg d attribute (where to be drawn)
  // referenced from ReactFlow.dev
  function getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  }) {
    const [sourceControlX, sourceControlY] = getControl({
      pos: sourcePosition,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY
    });
    const [targetControlX, targetControlY] = getControl({
      pos: targetPosition,
      x1: targetX,
      y1: targetY,
      x2: sourceX,
      y2: sourceY
    });
    return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
  }
  const bottom_top = {
    id: 'e1-2',
    sourceX: 100,
    sourceY: 100,
    targetX: 200,
    targetY: 200,
    sourcePosition: 'bottom',
    targetPosition: 'top',
    data: {
      label: 'this is the test edge'
    }
  }
  const right_left = {
    id: 'e1-2',
    sourceX: 100,
    sourceY: 100,
    targetX: 200,
    targetY: 200,
    sourcePosition: 'right',
    targetPosition: 'left',
    data: {
      label: 'this is the test edge'
    }
  }

  const left_right = {
    id: 'e1-2',
    sourceX: 300,
    sourceY: 100,
    targetX: 200,
    targetY: 200,
    sourcePosition: 'left',
    targetPosition: 'right',
    data: {
      label: 'this is the test edge'
    }
  }
  
  const top_left = {
    id: 'e1-2',
    sourceX: 100,
    sourceY: 300,
    targetX: 200,
    targetY: 200,
    sourcePosition: 'top',
    targetPosition: 'left',
    data: {
      label: 'this is the test edge'
    }
  }

  const top_right = {
    id: 'e1-2',
    sourceX: 100,
    sourceY: 400,
    targetX: 200,
    targetY: 200,
    sourcePosition: 'top',
    targetPosition: 'right',
    data: {
      label: 'this is the test edge'
    }
  }

  const bottom_left = {
    id: 'e1-2',
    sourceX: 100,
    sourceY: 100,
    targetX: 200,
    targetY: 200,
    sourcePosition: 'bottom',
    targetPosition: 'left',
    data: {
      label: 'this is the test edge'
    }
  }
  console.log('bottom to top-->',getSimpleBezierPath(bottom_top))
  console.log('right to left-->',getSimpleBezierPath(right_left))
  console.log('left to right-->',getSimpleBezierPath(left_right))
  console.log('top to left-->',getSimpleBezierPath(top_left))
  console.log('top to right-->',getSimpleBezierPath(top_right))
  console.log('bottom to left-->',getSimpleBezierPath(bottom_left))
  