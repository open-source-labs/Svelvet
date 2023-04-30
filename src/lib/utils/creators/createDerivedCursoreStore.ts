import type { Readable, Writable } from 'svelte/store';
import type { Graph } from '$lib/types';
import { derived } from 'svelte/store';
import { calculateRelativeCursor } from '../calculators';

export function createDerivedCursorStore(
	cursorPositionRaw: Readable<{ x: number; y: number }>,
	dimensions: Graph['dimensions'],
	translation: Graph['transforms']['translation'],
	scale: Writable<number>
): Readable<{ x: number; y: number }> {
	const cursorPosition: Readable<{ x: number; y: number }> = derived(
		[cursorPositionRaw, dimensions, translation, scale],
		([$cursorPositionRaw, $dimensions, $translation, $scale]) => {
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
				$translation
			);
		}
	);

	return cursorPosition;
}
