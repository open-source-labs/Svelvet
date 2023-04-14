import type { XYPair, Direction } from '$lib/types';

export const directionVectors: Record<Direction, XYPair> = {
	north: { x: 0, y: -1 },
	south: { x: 0, y: 1 },
	east: { x: 1, y: 0 },
	west: { x: -1, y: 0 },
	self: { x: 0, y: 0 }
};
