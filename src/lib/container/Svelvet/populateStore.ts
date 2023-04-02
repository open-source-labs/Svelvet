import type { Node, Graph } from '$lib/types';
import { get } from 'svelte/store';

export function populateStore(nodes: Node[], graph: Graph) {
	for (const node of nodes) {
		const { position, dimensions } = node;
		const { width, height } = dimensions;
		const { x, y } = position;
		const { bounds } = graph;
		const { top, left, right, bottom } = bounds;

		const nodeWidth = get(width);
		const nodeHeight = get(height);
		const nodeX = get(x);
		const nodeY = get(y);

		if (nodeX < get(left)) {
			left.set(nodeX);
		}
		if (nodeY < get(top)) {
			top.set(nodeY);
		}
		if (nodeX + nodeWidth > get(right)) {
			right.set(nodeX + nodeWidth);
		}
		if (nodeY + nodeHeight > get(bottom)) {
			bottom.set(nodeY + nodeHeight);
		}

		graph.nodes.add(node);
	}
}
