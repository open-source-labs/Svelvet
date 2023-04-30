import type { Graph, XYPair } from '$lib/types';
import { get } from 'svelte/store';

export function updateTranslation(
	initialClickPosition: XYPair,
	currentCursorPosition: XYPair,
	transforms: Graph['transforms']
): XYPair {
	const { scale, translation } = transforms;
	const scaleValue = get(scale);
	const graphTranslation = get(translation);

	const deltaX = currentCursorPosition.x - initialClickPosition.x;
	const deltaY = currentCursorPosition.y - initialClickPosition.y;

	const newTranslationX = graphTranslation.x + deltaX * scaleValue;
	const newTranslationY = graphTranslation.y + deltaY * scaleValue;

	return { x: newTranslationX, y: newTranslationY };
}
