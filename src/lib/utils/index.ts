import type { Dimensions, Rect, Box, XYPosition, CoordinateExtent } from '../types';

// Defines the dimensions of the node
export const getDimensions = (node: HTMLDivElement): Dimensions => ({
	width: node.offsetWidth,
	height: node.offsetHeight
});

export const clamp = (val: number, min: number = 0, max: number = 1): number =>
	Math.min(Math.max(val, min), max);

export const clampPosition = (position: XYPosition, extent: CoordinateExtent) => ({
	x: clamp(position.x, extent[0][0], extent[1][0]),
	y: clamp(position.y, extent[0][1], extent[1][1])
});

export const getHostForElement = (element: HTMLElement): Document | ShadowRoot =>
	(element.getRootNode?.() as Document | ShadowRoot) || window?.document;

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
