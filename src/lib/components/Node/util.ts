import type { Writable } from 'svelte/store';
import type { Node, Graph } from '$lib/types';
import { get } from 'svelte/store';

export function moveNodes(
	graph: Graph,
	deltaX: number,
	deltaY: number,
	nodeGroup: Writable<Set<Node>>
) {
	const { bounds } = graph;

	const { left, right, top, bottom } = bounds;
	const leftBounds = get(left);
	const rightBounds = get(right);
	const topBounds = get(top);
	const bottomBounds = get(bottom);

	nodeGroup.update((nodeGroup) => {
		nodeGroup.forEach((node) => {
			//const node = get(graph.nodes.get(nodeKey));
			const { position, dimensions } = node;
			const { x, y } = position;
			const { width, height } = dimensions;

			const oldX = get(x);
			const oldY = get(y);
			const nodeWidth = get(width);
			const nodeHeight = get(height);

			const newX = oldX + deltaX;
			const newY = oldY + deltaY;
			x.set(newX);
			y.set(newY);

			if (deltaX < 0) {
				if (newX < leftBounds) {
					left.set(newX);
				}
			} else {
				if (newX + nodeWidth > rightBounds) {
					right.set(newX + nodeWidth);
				}
			}

			if (deltaY < 0) {
				if (newY < topBounds) {
					top.set(newY);
				}
				if (newY + nodeHeight === bottomBounds) {
					bottom.set(newY + nodeHeight);
				}
			} else {
				if (newY + nodeHeight > bottomBounds) {
					bottom.set(newY + nodeWidth);
				}
				if (y === top) {
					top.set(newY);
				}
			}
		});
		return nodeGroup;
	});
}
