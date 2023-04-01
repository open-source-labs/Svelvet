import type { XYPosition } from '$lib/types';

export function translateGraph(
	writableTranslation: XYPosition,
	translation: { x: number | null; y: number | null }
) {
	const { x: translationX, y: translationY } = writableTranslation;
	if (translation.x) translationX.set(translation.x);
	if (translation.y) translationY.set(translation.y);
}
