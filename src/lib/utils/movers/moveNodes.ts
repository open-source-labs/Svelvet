import type { Writable } from 'svelte/store';
import type { Node, Graph, XYPair, GroupBox, GroupKey } from '$lib/types';
import { get } from 'svelte/store';

export function captureGroup(group: Writable<Set<Node | GroupBox>>): XYPair[] {
	const groupSet = get(group);
	const groupArray = Array.from(groupSet);
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
	groupName: GroupKey,
	snapTo?: number
) {
	const { bounds, cursor } = graph;
	const { left, right, top, bottom } = bounds;

	const leftBounds = get(left);
	const rightBounds = get(right);
	const topBounds = get(top);
	const bottomBounds = get(bottom);
	const groups = get(graph.groups);

	const nodeGroup = groups[groupName].nodes;

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

	if (!nodeGroup) return;
	const groupBounds = {
		left: -Infinity,
		right: Infinity,
		top: -Infinity,
		bottom: Infinity
	};
	Array.from(get(nodeGroup)).forEach((node, index) => {
		const { group, moving } = node;
		const { position, dimensions } = node;
		const { x, y } = position;
		const { width, height } = dimensions;
		const initialPosition = initialNodePositions[index];
		moving.set(true);
		const nodeWidth = get(width);
		const nodeHeight = get(height);

		let groupBox: GroupBox | undefined;

		if (groupName === 'selected') {
			const localGroupName = get(group);
			const groupBoxes = get(graph.groupBoxes);
			if (localGroupName) groupBox = groupBoxes[localGroupName];
		}

		if (groupBox) {
			//alert('group box exists');
			const { dimensions, position } = groupBox;
			const { width, height } = dimensions;
			const { x, y } = position;
			const buffer = 10;
			groupBounds.left = get(x) + buffer;
			groupBounds.right = get(x) + get(width) - nodeWidth - buffer;
			groupBounds.top = get(y) + buffer;
			groupBounds.bottom = get(y) + get(height) - nodeHeight - buffer;
		}

		moveElement(initialPosition, delta, x, y, groupBounds);

		if (delta.x < 0) {
			if (newX < leftBounds) {
				left.set(newX);
			}
		} else {
			if (newX + nodeWidth > rightBounds) {
				right.set(newX + nodeWidth);
			}
		}

		if (delta.y < 0) {
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
}
export function moveElement(
	initialPosition: XYPair,
	delta: XYPair,
	xStore: Writable<number>,
	yStore: Writable<number>,
	bounds: { left: number; right: number; top: number; bottom: number }
) {
	xStore.set(Math.min(Math.max(bounds.left, initialPosition.x + delta.x), bounds.right));
	yStore.set(Math.min(Math.max(bounds.top, initialPosition.y + delta.y), bounds.bottom));
}
