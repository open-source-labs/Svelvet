<script lang="ts">
  import BaseEdge from '$lib/Edges/BaseEdge.svelte';
  import { Position } from '$lib/types/utils';
  import type { DerivedEdge } from '$lib/types/types';
  import { getCenter } from './utils';

  // how to create a smooth, controlled beizer edge from source and target positions
  // referenced from ReactFlow.dev
  interface GetSimpleBezierPathParams {
    sourceX: number;
    sourceY: number;
    sourcePosition?: Position;
    targetX: number;
    targetY: number;
    targetPosition?: Position;
  }

  interface GetControlParams {
    pos?: Position;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number?, number?] {
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
  }: GetSimpleBezierPathParams): string {
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
  
function getSimpleBezierCenter({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetSimpleBezierPathParams): [number, number, number, number] {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
  // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  const xOffset = Math.abs(centerX - sourceX);
  const yOffset = Math.abs(centerY - sourceY);
  return [centerX, centerY, xOffset, yOffset];
}

  export let edge: DerivedEdge;

//TODO - Check for errors regarding source position and Target Positon, changed from source Position.Top to bottom, and target Position from Bottom to Top.

  $: params = {
    sourceX: edge.sourceX,
    sourceY: edge.sourceY,
    sourcePosition: edge.sourcePosition,
    targetX: edge.targetX,
    targetY: edge.targetY,
    targetPosition: edge.targetPosition
  };
  
  // $: params = {
  //   sourceX: edge.sourceX,
  //   sourceY: edge.sourceY,
  //   sourcePosition: Position.Bottom,
  //   targetX: edge.targetX,
  //   targetY: edge.targetY,
  //   targetPosition: Position.Top
  // };


  // pass in params to function that returns a string value for SVG path d attribute
  $: path = getSimpleBezierPath(params);
  //TODO This needs to be changed to get BezierCenter
  $: [centerX, centerY] = getSimpleBezierCenter(params);

  // pass necessary values to BaseEdge component
  // BaseEdge renders a 'base' path that can be customized by parent Edge components
  $: baseEdgeProps = {
    ...edge,
    path: path,
    centerX: centerX,
    centerY: centerY
  };
</script>

<BaseEdge {baseEdgeProps} />
