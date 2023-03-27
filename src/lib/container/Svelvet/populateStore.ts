import type { Node, Graph } from '$lib/types';

export function populateStore(nodes: Node[], graph: Graph) {
	for (const node of nodes) {
		const { position, dimensions } = node;
		const { width, height } = dimensions;
		const { x, y } = position;
		const { bounds } = graph;
		const { top, left, right, bottom } = bounds;

		let graphTop, graphLeft, graphRight, graphBottom;
		let nodeWidth, nodeHeight, nodeX, nodeY;

		width.subscribe((width) => {
			nodeWidth = width;
		});
		height.subscribe((height) => {
			nodeHeight = height;
		});
		x.subscribe((x) => {
			nodeX = x;
		});
		y.subscribe((y) => {
			nodeY = y;
		});

		top.subscribe((top) => {
			graphTop = top;
		});
		left.subscribe((left) => {
			graphLeft = left;
		});
		right.subscribe((right) => {
			graphRight = right;
		});
		bottom.subscribe((bottom) => {
			graphBottom = bottom;
		});

		if (nodeX < graphLeft) {
			left.set(nodeX);
		}
		if (nodeY < graphTop) {
			top.set(nodeY);
		}
		if (nodeX + nodeWidth > graphRight) {
			right.set(nodeX + nodeWidth);
		}
		if (nodeY + nodeHeight > graphBottom) {
			bottom.set(nodeY + nodeHeight);
		}
		console.log('adding');
		graph.nodes.add(node);
	}
}
