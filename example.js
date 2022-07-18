  //import BaseEdge from '$lib/Edges/BaseEdge.svelte';
  //import { Position } from '$lib/types/utils';
  //import { getCenter } from './utils';
  const Position = {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom'
  }
const bottomLeftCorner = (x, y, size) =>
  `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
const leftBottomCorner = (x, y, size) =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
const bottomRightCorner = (x, y, size) =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
const rightBottomCorner = (x, y, size) =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
const leftTopCorner = (x, y, size) => `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
const topLeftCorner = (x, y, size) => `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
const topRightCorner = (x, y, size) => `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
const rightTopCorner = (x, y, size) => `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

const LeftOrRight = [Position.Left, Position.Right];

const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}) => {
  const sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition);
  const targetIsLeftOrRight = LeftOrRight.includes(targetPosition);

  // we expect flows to be horizontal or vertical (all handles left or right respectively top or bottom)
  // a mixed edge is when one the source is on the left and the target is on the top for example.
  const mixedEdge = (sourceIsLeftOrRight && !targetIsLeftOrRight) || (targetIsLeftOrRight && !sourceIsLeftOrRight);

  if (mixedEdge) {
    const xOffset = sourceIsLeftOrRight ? Math.abs(targetX - sourceX) : 0;
    const centerX = sourceX > targetX ? sourceX - xOffset : sourceX + xOffset;

    const yOffset = sourceIsLeftOrRight ? 0 : Math.abs(targetY - sourceY);
    const centerY = sourceY < targetY ? sourceY + yOffset : sourceY - yOffset;

    return [centerX, centerY, xOffset, yOffset];
  }

  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
};

  function getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition = Position.Bottom,
    targetX,
    targetY,
    targetPosition = Position.Top,
    borderRadius = 5,
    centerX,
    centerY,
  }) {
    const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY });
    const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
    const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
    const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
    const leftAndRight = [Position.Left, Position.Right];
    const cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    const cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  
    let firstCornerPath = null;
    let secondCornerPath = null;
  
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY ? bottomLeftCorner(sourceX, cY, cornerSize) : topLeftCorner(sourceX, cY, cornerSize);
      secondCornerPath =
        sourceY <= targetY ? rightTopCorner(targetX, cY, cornerSize) : rightBottomCorner(targetX, cY, cornerSize);
    } else {
      firstCornerPath =
        sourceY < targetY ? bottomRightCorner(sourceX, cY, cornerSize) : topRightCorner(sourceX, cY, cornerSize);
      secondCornerPath =
        sourceY < targetY ? leftTopCorner(targetX, cY, cornerSize) : leftBottomCorner(targetX, cY, cornerSize);
    }
  
    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
      if (sourceX <= targetX) {
        firstCornerPath =
          sourceY <= targetY ? rightTopCorner(cX, sourceY, cornerSize) : rightBottomCorner(cX, sourceY, cornerSize);
        secondCornerPath =
          sourceY <= targetY ? bottomLeftCorner(cX, targetY, cornerSize) : topLeftCorner(cX, targetY, cornerSize);
      } else if (
        (sourcePosition === Position.Right && targetPosition === Position.Left) ||
        (sourcePosition === Position.Left && targetPosition === Position.Right) ||
        (sourcePosition === Position.Left && targetPosition === Position.Left)
      ) {
        // and sourceX > targetX
        firstCornerPath =
          sourceY <= targetY ? leftTopCorner(cX, sourceY, cornerSize) : leftBottomCorner(cX, sourceY, cornerSize);
        secondCornerPath =
          sourceY <= targetY ? bottomRightCorner(cX, targetY, cornerSize) : topRightCorner(cX, targetY, cornerSize);
      }
    } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
      if (sourceX <= targetX) {
        firstCornerPath =
          sourceY <= targetY
            ? rightTopCorner(targetX, sourceY, cornerSize)
            : rightBottomCorner(targetX, sourceY, cornerSize);
      } else {
        firstCornerPath =
          sourceY <= targetY
            ? leftTopCorner(targetX, sourceY, cornerSize)
            : leftBottomCorner(targetX, sourceY, cornerSize);
      }
      secondCornerPath = '';
    } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
      if (sourceX <= targetX) {
        firstCornerPath =
          sourceY <= targetY
            ? bottomLeftCorner(sourceX, targetY, cornerSize)
            : topLeftCorner(sourceX, targetY, cornerSize);
      } else {
        firstCornerPath =
          sourceY <= targetY
            ? bottomRightCorner(sourceX, targetY, cornerSize)
            : topRightCorner(sourceX, targetY, cornerSize);
      }
      secondCornerPath = '';
    }
  
    return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;
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
  console.log('bottom to top-->',getSmoothStepPath(bottom_top))
  console.log('right to left-->',getSmoothStepPath(right_left))
  console.log('left to right-->',getSmoothStepPath(left_right))
  console.log('top to left-->',getSmoothStepPath(top_left))
  console.log('top to right-->',getSmoothStepPath(top_right))
  console.log('bottom to left-->',getSmoothStepPath(bottom_left))
  
