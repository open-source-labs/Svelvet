import { Position } from '$lib/types/utils';


export interface GetCenterParams {
    srcX: number;
    srcY: number;
    trgX: number;
    trgY: number;
    sourcePosition?: Position;
    targetPosition?: Position;
}
const LeftOrRight = [Position.Left, Position.Right];

export const getCenter = ({
  srcX,
  srcY,
  trgX,
  trgY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: GetCenterParams): [number, number, number, number] => {
  const sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition);
  const targetIsLeftOrRight = LeftOrRight.includes(targetPosition);

  // we expect flows to be horizontal or vertical (all handles left or right respectively top or bottom)
  // a mixed edge is when one the source is on the left and the target is on the top for example.
  const mixedEdge = (sourceIsLeftOrRight && !targetIsLeftOrRight) || (targetIsLeftOrRight && !sourceIsLeftOrRight);

  if (mixedEdge) {
    const xOffset = sourceIsLeftOrRight ? Math.abs(trgX - srcX) : 0;
    const centerX = srcX > trgX ? srcX - xOffset : srcX + xOffset;

    const yOffset = sourceIsLeftOrRight ? 0 : Math.abs(trgY - srcY);
    const centerY = srcY < trgY ? srcY + yOffset : srcY - yOffset;

    return [centerX, centerY, xOffset, yOffset];
  }

  const xOffset = Math.abs(trgX - srcX) / 2;
  const centerX = trgX < srcX ? trgX + xOffset : trgX - xOffset;

  const yOffset = Math.abs(trgY - srcY) / 2;
  const centerY = trgY < srcY ? trgY + yOffset : trgY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
};