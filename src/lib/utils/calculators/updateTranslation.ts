import type { Graph, XYPair } from '$lib/types';
import { get } from 'svelte/store';

export function updateTranslation(
	initialClickPosition: XYPair,
	currentCursorPosition: XYPair,
	transforms: Graph['transforms']
): number[] {
	const { scale, translation } = transforms;
	const scaleValue = get(scale);

	const deltaX = currentCursorPosition.x - initialClickPosition.x;
	const deltaY = currentCursorPosition.y - initialClickPosition.y;

	const newTranslationX = get(translation.x) + deltaX * scaleValue;
	const newTranslationY = get(translation.y) + deltaY * scaleValue;

	return [newTranslationX, newTranslationY];
}
