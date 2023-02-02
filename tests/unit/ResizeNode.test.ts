import { ResizeNode } from '$lib/resizableNodes/models/ResizeNode';

describe('tests ResizeNode', () => {
  const resizeNode = new ResizeNode('id', 'canvasId', 'nodeId', 50, 100);

  test('defines setPosition', () => {
    expect(typeof resizeNode.setPosition).toBe('function');
  });

  //create a store with a node and resize node and check that they created correctly.

  //Then, call set PositionAndCascade on resizeNode and make sure the width/height of the node also changes.

  //Make sure when you call delete on the node that the resizeNode also disappears.
});
