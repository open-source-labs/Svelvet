import type { Readable, Writable } from 'svelte/store';
import type { Graph } from '$lib/types';
import { derived } from 'svelte/store';
import { calculateRelativeCursor } from '../calculators';

export function createDerivedCursorStore(
	cursorPositionRaw: Readable<{ x: number; y: number }>,
	dimensions: Graph['dimensions'],
	translation: { x: Writable<number>; y: Writable<number> },
	scale: Writable<number>
): Readable<{ x: number; y: number }> {
	const cursorPosition: Readable<{ x: number; y: number }> = derived(
		[cursorPositionRaw, dimensions, translation.x, translation.y, scale],
		([$cursorPositionRaw, $dimensions, $translationX, $translationY, $scale]) => {
			const e = {
				clientX: $cursorPositionRaw.x,
				clientY: $cursorPositionRaw.y
			};

			return calculateRelativeCursor(
				e,
				$dimensions.top,
				$dimensions.left,
				$dimensions.width,
				$dimensions.height,
				$scale,
				$translationX,
				$translationY
			);
		}
	);

	return cursorPosition;
}
