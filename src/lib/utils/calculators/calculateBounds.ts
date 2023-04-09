import type { Node } from '$lib/types';
import { get } from 'svelte/store';

export function calculateBounds(nodes: Node[]) {
	const leftValues = nodes.map((n) => get(n.position.x));
	const topValues = nodes.map((n) => get(n.position.y));
	const rightValues = nodes.map((n) => get(n.position.x) + get(n.dimensions.width));
	const bottomValues = nodes.map((n) => get(n.position.y) + get(n.dimensions.height));

	const minX = Math.min(...leftValues);
	const maxX = Math.max(...rightValues);
	const minY = Math.min(...topValues);
	const maxY = Math.max(...bottomValues);

	const width = maxX - minX;
	const height = maxY - minY;

	return {
		minX,
		maxX,
		minY,
		maxY,
		width,
		height
	};
}
