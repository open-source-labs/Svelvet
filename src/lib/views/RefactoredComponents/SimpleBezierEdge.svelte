<script lang="ts">
  import BaseEdge from '$lib/views/RefactoredComponents/BaseEdge.svelte';
  import { Position } from './utils';
  import type { EdgeType } from '$lib/models/types';

  // how to create a smooth, controlled beizer edge from source and target positions
  // referenced from ReactFlow.dev
  interface GetSimpleBezierPathParams {
    sourceX: number;
    sourceY: number;
    sourcePosition?: Position;
    targetX: number;
    targetY: number;
    targetPosition?: Position;
    curvature?: number;
  }

  interface GetControlParams {
    pos: Position;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    c: number;
  }

  function calculateControlOffset(distance: number, curvature: number): number {
    if (distance >= 0) {
      return 0.5 * distance;
    } else {
      return curvature * 25 * Math.sqrt(-distance);
    }
  }
  // get the control point for the bezier curve (in the middle of the edge)
  function getControlWithCurvature({
    pos,
    x1,
    y1,
    x2,
    y2,
    c,
  }: GetControlParams): [number, number] {
    let ctX: number, ctY: number;
    switch (pos) {
      case Position.Left:
        {
          ctX = x1 - calculateControlOffset(x1 - x2, c);
          ctY = y1;
        }
        break;
      case Position.Right:
        {
          ctX = x1 + calculateControlOffset(x2 - x1, c);
          ctY = y1;
        }
        break;
      case Position.Top:
        {
          ctX = x1;
          ctY = y1 - calculateControlOffset(y1 - y2, c);
        }
        break;
      case Position.Bottom:
        {
          ctX = x1;
          ctY = y1 + calculateControlOffset(y2 - y1, c);
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
    sourcePosition = Position.Bottom,
    targetX,
    targetY,
    targetPosition = Position.Top,
    curvature = 0.25,
  }: GetSimpleBezierPathParams): string {
    const [sourceControlX, sourceControlY] = getControlWithCurvature({
      pos: sourcePosition,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY,
      c: curvature,
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
      pos: targetPosition,
      x1: targetX,
      y1: targetY,
      x2: sourceX,
      y2: sourceY,
      c: curvature,
    });
    return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
  }

  // determining center of the bezier curve to know where to place the bezier edge text label
  function getSimpleBezierCenter({
    sourceX,
    sourceY,
    sourcePosition = Position.Bottom,
    targetX,
    targetY,
    targetPosition = Position.Top,
    curvature = 0.25,
  }: GetSimpleBezierPathParams): [number, number, number, number] {
    const [sourceControlX, sourceControlY] = getControlWithCurvature({
      pos: sourcePosition,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY,
      c: curvature,
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
      pos: targetPosition,
      x1: targetX,
      y1: targetY,
      x2: sourceX,
      y2: sourceY,
      c: curvature,
    });
    // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
    // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
    const centerX =
      sourceX * 0.125 +
      sourceControlX * 0.375 +
      targetControlX * 0.375 +
      targetX * 0.125;
    const centerY =
      sourceY * 0.125 +
      sourceControlY * 0.375 +
      targetControlY * 0.375 +
      targetY * 0.125;
    const xOffset = Math.abs(centerX - sourceX);
    const yOffset = Math.abs(centerY - sourceY);
    return [centerX, centerY, xOffset, yOffset];
  }

  export let edge: EdgeType;

  $: params = {
    sourceX: edge.sourceX,
    sourceY: edge.sourceY,
    targetX: edge.targetX,
    targetY: edge.targetY,
    curvature: 0.25,
  };

  // pass in params to function that returns a string value for SVG path d attribute (where to be drawn)
  $: path = getSimpleBezierPath(params);

  $: [centerX, centerY] = getSimpleBezierCenter(params);

  // pass necessary values to BaseEdge component
  // BaseEdge renders a 'base' path that can be customized by parent Edge components
  $: baseEdgeProps = {
    ...edge,
    path: path,
    centerX: centerX,
    centerY: centerY,
  };
</script>

<BaseEdge {baseEdgeProps} />
