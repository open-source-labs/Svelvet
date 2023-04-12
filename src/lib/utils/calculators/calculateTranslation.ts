import type { GraphDimensions, XYPair } from '$lib/types';

export function calculateTranslation(
	oldScale: number,
	newScale: number,
	currentTranslation: XYPair,
	pointerPosition: XYPair,
	dimensions: GraphDimensions
) {
	const newTranslation = { x: 0, y: 0 };
	// Calculate the cursor position relative to the wrapper
	const pointerXRelativeToWrapper = pointerPosition.x - dimensions.left - dimensions.width / 2;
	const pointerYRelativeToWrapper = pointerPosition.y - dimensions.top - dimensions.height / 2;

	// Calculate the cursor position relative to the scaled content
	const pointerXRelativeToContent = (pointerXRelativeToWrapper - currentTranslation.x) / oldScale;
	const pointerYRelativeToContent = (pointerYRelativeToWrapper - currentTranslation.y) / oldScale;

	// Update the offsets based on the cursor position and the scale value
	newTranslation.x = pointerXRelativeToWrapper - pointerXRelativeToContent * newScale;
	newTranslation.y = pointerYRelativeToWrapper - pointerYRelativeToContent * newScale;

	return newTranslation;
}
