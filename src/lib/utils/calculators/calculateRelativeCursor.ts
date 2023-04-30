import type { Graph } from '$lib/types';

export const calculateRelativeCursor = (
	e: { clientX: number; clientY: number },
	top: number,
	left: number,
	width: number,
	height: number,
	scale: number,
	translation: { x: number; y: number }
) => {
	const { clientX, clientY } = e;
	const scaleCapture = scale;

	const xRelativeToWrapper = clientX - left;
	const yRelativeToWrapper = clientY - top;

	const xOffsetDueToTranslation = translation.x;
	const yOffsetDueToTranslation = translation.y;

	const xOffsetDuetToScale = (width * (1 - scale)) / 2;
	const yOffsetDuetToScale = (height * (1 - scale)) / 2;

	const newX = xRelativeToWrapper - xOffsetDueToTranslation - xOffsetDuetToScale;
	const newY = yRelativeToWrapper - yOffsetDueToTranslation - yOffsetDuetToScale;

	const newCursorX = newX / scaleCapture;
	const newCursorY = newY / scaleCapture;

	return { x: newCursorX, y: newCursorY };
};
import { get } from 'svelte/store';

export function calculateRelativePosition(
	dimensions: Graph['dimensions'],
	transforms: Graph['transforms'],
	position: { x: number; y: number }
) {
	const { top, left, width, height } = get(dimensions);
	const scale = get(transforms.scale);
	const translation = get(transforms.translation);
	const scaled = calculateRelativeCursor(
		{ clientX: position.x, clientY: position.y },
		top,
		left,
		width,
		height,
		scale,
		translation
	);
	return { scaled, scale };
}
