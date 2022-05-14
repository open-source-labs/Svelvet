import type { Dimensions, Rect, Box } from '../types';

// Defines the dimensions of the node
export const getDimensions = (node: HTMLDivElement): Dimensions => ({
	width: node.offsetWidth,
	height: node.offsetHeight
});

// Defines the corner coordinates surrounding box1 and box2 (a box around the 2 boxes)
export const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
	x: Math.min(box1.x, box2.x),
	y: Math.min(box1.y, box2.y),
	x2: Math.max(box1.x2, box2.x2),
	y2: Math.max(box1.y2, box2.y2)
});

//gets the end points of the lengths of the horizontal and vertical components of the node
export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
	x,
	y,
	x2: x + width,
	y2: y + height
});
//gets the lengths of the horizontal and vertical components of the node by subtracting the horizontal and vertical end points from their starting points
export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
	x,
	y,
	width: x2 - x,
	height: y2 - y
});
