import { Position } from '$lib/types/utils';
//import { Node } from '$lib/types/types';



export interface GetCenterParams {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition?: Position;
    targetPosition?: Position;
}
const LeftOrRight = [Position.Left, Position.Right];

export const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: GetCenterParams): [number, number, number, number] => {
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

export const addDefaultPositions = (nodeArray: Node[]) :void => {
  //create a counter that increments to add values to the unassigned node positions
  let newPostionsObject = {
    x: 50,
    y: 50
  };
  //iterate through the nodes Array and check if any node where !node.position
  nodeArray.forEach((element: Node) => {
    if(!element.position){
    // assign an {x: , y:}
      const {x, y} = newPostionsObject;
      element.position = {x: x, y: y};
    }
    //increment the assignments so they don't spawn on top of one another
    newPostionsObject.x += 80;
    newPostionsObject.y += 80;
  });
}