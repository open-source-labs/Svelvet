import type { Writable } from 'svelte/store';
import type { Node, Graph, XYPair, GroupProperty } from '$lib/types';
import { get } from 'svelte/store';

export function captureGroup(group: Writable<Set<Node | GroupProperty>>): XYPair[] {
	const groupSet = get(group);
	const groupArray = Array.from(groupSet);
	console.log(groupArray);
	return groupArray.map((node) => {
		const { position } = node;
		const { x, y } = position;
		return {
			x: get(x),
			y: get(y)
		};
	});
}

export function moveNodes(
	graph: Graph,
	initialClickPosition: XYPair,
	initialNodePositions: XYPair[],
	groupName: string,
	snapTo?: number
) {
	const { bounds, cursor, groupProperties, groups } = graph;
	const { left, right, top, bottom } = bounds;
	const leftBounds = get(left);
	const rightBounds = get(right);
	const topBounds = get(top);
	const bottomBounds = get(bottom);
	console.log('moving');

	const nodeGroup = get(graph.groups)[groupName];

	const groupBox = get(groupProperties)[groupName];

	console.log({ groupBox, groupName });

	const cursorPosition = get(cursor);
	const newX = cursorPosition.x - initialClickPosition.x;
	const newY = cursorPosition.y - initialClickPosition.y;

	let snapX = 0;
	let snapY = 0;

	if (snapTo) {
		snapX = newX % snapTo;
		snapY = newY % snapTo;
	}

	const delta = { x: newX + snapX, y: newY + snapY };

	if (groupBox) {
		const { position } = groupBox;
		const { x, y } = position;
		console.log('x', get(x), 'y', get(y));

		// const initialGroupBoxPosition = initialNodePositions[0];
		// console.log(initialGroupBoxPosition);
		// moveElement(initialGroupBoxPosition, delta, x, y);
	}

	if (!nodeGroup) return;
	nodeGroup.update((nodeGroup) => {
		Array.from(nodeGroup).forEach((node, index) => {
			console.log({ index });
			//const node = get(graph.nodes.get(nodeKey));
			const { position, dimensions } = node;
			const { x, y } = position;
			const { width, height } = dimensions;
			const initialPosition = initialNodePositions[index];

			const oldX = get(x);
			const oldY = get(y);
			const nodeWidth = get(width);
			const nodeHeight = get(height);

			moveElement(initialPosition, delta, x, y);

			// if (deltaX < 0) {
			// 	if (newX < leftBounds) {
			// 		left.set(newX);
			// 	}
			// } else {
			// 	if (newX + nodeWidth > rightBounds) {
			// 		right.set(newX + nodeWidth);
			// 	}
			// }

			// if (deltaY < 0) {
			// 	if (newY < topBounds) {
			// 		top.set(newY);
			// 	}
			// 	if (newY + nodeHeight === bottomBounds) {
			// 		bottom.set(newY + nodeHeight);
			// 	}
			// } else {
			// 	if (newY + nodeHeight > bottomBounds) {
			// 		bottom.set(newY + nodeWidth);
			// 	}
			// 	if (y === top) {
			// 		top.set(newY);
			// 	}
			// }
		});
		return nodeGroup;
	});
}
export function moveElement(
	initialPosition: XYPair,
	delta: XYPair,
	xStore: Writable<number>,
	yStore: Writable<number>
) {
	xStore.set(initialPosition.x + delta.x);
	yStore.set(initialPosition.y + delta.y);
}
// const moveElement = (node: Node, index) => {
// 	//const node = get(graph.nodes.get(nodeKey));
// 	const { position, dimensions } = node;
// 	const { x, y } = position;
// 	const { width, height } = dimensions;

// 	const oldX = get(x);
// 	const oldY = get(y);
// 	const nodeWidth = get(width);
// 	const nodeHeight = get(height);

// 	const newX = get(cursor).x - initialClickPosition.x;
// 	const newY = get(cursor).y - initialClickPosition.y;

// 	let snapX = 0;
// 	let snapY = 0;

// 	if (snapTo) {
// 		snapX = newX % snapTo;
// 		snapY = newY % snapTo;
// 	}

// 	x.set(initialNodePositions[index].x + newX - snapX);
// 	y.set(initialNodePositions[index].y + newY - snapY);
