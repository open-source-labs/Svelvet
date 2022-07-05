<script lang="ts">
import BaseEdge from '$lib/Edges/BaseEdge.svelte';
import { getCenter } from './utils';
import { Position } from '$lib/types/utils';
import EdgeAnchor from './EdgeAnchor.svelte';
import type { DerivedEdge } from '$lib/types';


/*  React           Svelte  This is for Bezier Path
    srcX         srcX
    srcY         srcY
    sourcePositon   same
    trgX         trgX
    trgY         trgY
    targetPosition  same
    
*/
// These are some helper methods for drawing the round corners
// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.
const bottomLeftCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
const leftBottomCorner = (x: number, y: number, size: number): string =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
const bottomRightCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
const rightBottomCorner = (x: number, y: number, size: number): string =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
const leftTopCorner = (x: number, y: number, size: number): string => `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
const topLeftCorner = (x: number, y: number, size: number): string => `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
const topRightCorner = (x: number, y: number, size: number): string => `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
const rightTopCorner = (x: number, y: number, size: number): string => `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

interface GetSmoothStepPathParams {
  srcX: number;
  srcY: number;
  sourcePosition?: Position;
  trgX: number;
  trgY: number;
  targetPosition?: Position;
  borderRadius?: number;
  centerX?: number;
  centerY?: number;
}

export function getSmoothStepPath({
  srcX,
  srcY,
  sourcePosition = Position.Bottom,
  trgX,
  trgY,
  targetPosition = Position.Top,
  borderRadius = 5,
  centerX,
  centerY,
}: GetSmoothStepPathParams): string {
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ srcX, srcY, trgX, trgY });
  const cornerWidth = Math.min(borderRadius, Math.abs(trgX - srcX));
  const cornerHeight = Math.min(borderRadius, Math.abs(trgY - srcY));
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
  const leftAndRight = [Position.Left, Position.Right];
  const cX = typeof centerX !== 'undefined' ? centerX : _centerX;
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY;

  let firstCornerPath = null;
  let secondCornerPath = null;

  if (srcX <= trgX) {
    firstCornerPath =
      srcY <= trgY ? bottomLeftCorner(srcX, cY, cornerSize) : topLeftCorner(srcX, cY, cornerSize);
    secondCornerPath =
      srcY <= trgY ? rightTopCorner(trgX, cY, cornerSize) : rightBottomCorner(trgX, cY, cornerSize);
  } else {
    firstCornerPath =
      srcY < trgY ? bottomRightCorner(srcX, cY, cornerSize) : topRightCorner(srcX, cY, cornerSize);
    secondCornerPath =
      srcY < trgY ? leftTopCorner(trgX, cY, cornerSize) : leftBottomCorner(trgX, cY, cornerSize);
  }

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (srcX <= trgX) {
      firstCornerPath =
        srcY <= trgY ? rightTopCorner(cX, srcY, cornerSize) : rightBottomCorner(cX, srcY, cornerSize);
      secondCornerPath =
        srcY <= trgY ? bottomLeftCorner(cX, trgY, cornerSize) : topLeftCorner(cX, trgY, cornerSize);
    } else if (
      (sourcePosition === Position.Right && targetPosition === Position.Left) ||
      (sourcePosition === Position.Left && targetPosition === Position.Right) ||
      (sourcePosition === Position.Left && targetPosition === Position.Left)
    ) {
      // and srcX > trgX
      firstCornerPath =
        srcY <= trgY ? leftTopCorner(cX, srcY, cornerSize) : leftBottomCorner(cX, srcY, cornerSize);
      secondCornerPath =
        srcY <= trgY ? bottomRightCorner(cX, trgY, cornerSize) : topRightCorner(cX, trgY, cornerSize);
    }
  } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
    if (srcX <= trgX) {
      firstCornerPath =
        srcY <= trgY
          ? rightTopCorner(trgX, srcY, cornerSize)
          : rightBottomCorner(trgX, srcY, cornerSize);
    } else {
      firstCornerPath =
        srcY <= trgY
          ? leftTopCorner(trgX, srcY, cornerSize)
          : leftBottomCorner(trgX, srcY, cornerSize);
    }
    secondCornerPath = '';
  } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (srcX <= trgX) {
      firstCornerPath =
        srcY <= trgY
          ? bottomLeftCorner(srcX, trgY, cornerSize)
          : topLeftCorner(srcX, trgY, cornerSize);
    } else {
      firstCornerPath =
        srcY <= trgY
          ? bottomRightCorner(srcX, trgY, cornerSize)
          : topRightCorner(srcX, trgY, cornerSize);
    }
    secondCornerPath = '';
  }

  return `M ${srcX},${srcY}${firstCornerPath}${secondCornerPath}L ${trgX},${trgY}`;
}
export let edge: DerivedEdge;

$: params = {
    srcX: edge.sourceX,
    srcY: edge.sourceY,
    sourcePosition: Position.Bottom,
    trgX: edge.targetX,
    trgY: edge.targetY,
    targetPosition: Position.Top,
    borderRadius: 5
  };

$: path = getSmoothStepPath(params);
//const {srcX, srcY, trgX, trgY, sourcePosition, targetPosition} = params
//const [centerX, centerY] = getCenter({ srcX, srcY, trgX, trgY, sourcePosition, targetPosition });

$: baseEdgeProps = {
  ...edge,
  path: path
};


</script>

<BaseEdge {baseEdgeProps} />