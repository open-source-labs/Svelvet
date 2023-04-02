import { moveNodes } from '$lib/utils';

interface ActiveIntervals extends Record<string, NodeJS.Timer | undefined> {}
const activeIntervals: ActiveIntervals = {};

export function handleArrowKey(
	key: string,
	graph: any,
	activeKeys: any,
	groups: any,
	translationX: any,
	translationY: any
) {
	const multiplier = activeKeys['Shift'] ? 2 : 1;
	const start = performance.now();
	const axis = key === 'ArrowLeft' || key === 'ArrowRight' ? 'x' : 'y';
	const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? 1 : -1;
	const startOffset = axis === 'x' ? translationX : translationY;
	const endOffset = startOffset + direction * 50 * multiplier;

	if (!activeIntervals[key]) {
		const interval = setInterval(() => {
			const time = performance.now() - start;

			if (axis === 'x') {
				const newX = startOffset + (endOffset - startOffset) * (time / 250);

				if (groups['selected'].size) {
					moveNodes(graph, -newX / 100, 0, groups['selected']);
				} else {
					translationX.set(newX);
				}
			} else {
				const newY = startOffset + (endOffset - startOffset) * (time / 250);
				if (groups['selected'].size) {
					moveNodes(graph, 0, -newY / 100, groups['selected']);
				} else {
					translationY.set(newY);
				}
			}
		}, 5);
		activeIntervals[key] = interval;
	}
}
