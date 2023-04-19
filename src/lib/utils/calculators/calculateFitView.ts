import type { GraphDimensions } from '$lib/types';

export function calculateFitView(
	dimensions: GraphDimensions,
	bounds: { top: number; left: number; right: number; bottom: number }
) {
	const { width, height } = dimensions;
	const { top, left, right, bottom } = bounds;
	const boundsWidth = right - left;
	const boundsHeight = bottom - top;

	if (!boundsWidth || !boundsHeight) return { x: null, y: null, scale: null };

	const centerX = left + boundsWidth / 2;
	const centerY = top + boundsHeight / 2;

	const scale = Math.min(width / boundsWidth, height / boundsHeight) * 0.8;

	const viewportCenterX = width / 2;
	const viewportCenterY = height / 2;

	const translateX = viewportCenterX - centerX;
	const translateY = viewportCenterY - centerY;

	return {
		x: translateX * scale,
		y: translateY * scale,
		scale: scale
	};
}
