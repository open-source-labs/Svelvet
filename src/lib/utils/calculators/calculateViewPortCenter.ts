import type { GraphDimensions } from '$lib/types';
import { calculateRelativeCursor } from './calculateRelativeCursor';

export function calculateViewportCenter(
	dimensions: GraphDimensions,
	translationX: number,
	translationY: number,
	scale: number
) {
	const { width, height, top, left } = dimensions;

	const viewportCenter = { clientX: width / 2, clientY: height / 2 };
	return calculateRelativeCursor(
		viewportCenter,
		top,
		left,
		width,
		height,
		scale,
		translationX,
		translationY
	);
}
