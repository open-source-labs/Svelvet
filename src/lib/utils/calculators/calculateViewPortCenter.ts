import type { GraphDimensions, XYPair } from '$lib/types';
import { calculateRelativeCursor } from './calculateRelativeCursor';

export function calculateViewportCenter(
	dimensions: GraphDimensions,
	translation: XYPair,
	scale: number
) {
	const { width, height, top, left } = dimensions;

	const viewportCenter = { clientX: width / 2, clientY: height / 2 };
	return calculateRelativeCursor(viewportCenter, top, left, width, height, scale, translation);
}
