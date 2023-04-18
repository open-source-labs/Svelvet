import type { Writable } from 'svelte/store';
import type { Node, Graph, XYPair, GroupBox } from '$lib/types';
import { get } from 'svelte/store';
import { initialClickPosition } from '$lib/stores';

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

export function moveNodes(graph: Graph, snapTo?: number) {
	const groups = get(graph.groups);
	const groupName = get(graph.activeGroup);

	if (!groupName) return;

	const nodeGroup = groups[groupName].nodes;

	if (!nodeGroup) return;

	const initialPositions = get(graph.initialNodePositions);
	const { x: initialClickX, y: initialClickY } = get(initialClickPosition);
	const cursorPosition = get(graph.cursor);

	const newX = cursorPosition.x - initialClickX;
	const newY = cursorPosition.y - initialClickY;

	const snapX = snapTo ? newX % snapTo : 0;
	const snapY = snapTo ? newY % snapTo : 0;

	const delta = { x: newX + snapX, y: newY + snapY };

	const groupBounds = {
		left: -Infinity,
		right: Infinity,
		top: -Infinity,
		bottom: Infinity
	};

	const nodeGroupArray = Array.from(get(nodeGroup));
	const groupBoxes = get(graph.groupBoxes);

	nodeGroupArray.forEach((node, index) => {
		const { group, moving, position, dimensions } = node;
		const { x, y } = position;
		const { width, height } = dimensions;
		const initialPosition = initialPositions[index];
		if (moving) moving.set(true);
		const nodeWidth = get(width);
		const nodeHeight = get(height);

		let groupBox: GroupBox | undefined;

		if (groupName === 'selected') {
			const localGroupName = get(group);
			if (localGroupName) groupBox = groupBoxes[localGroupName];
		}

		if (!groupBox) {
			moveElement(initialPosition, delta, x, y);
		} else {
			const { dimensions, position } = groupBox;
			const { width, height } = dimensions;
			const { x, y } = position;
			const buffer = 10;
			groupBounds.left = get(x) + buffer;
			groupBounds.right = get(x) + get(width) - nodeWidth - buffer;
			groupBounds.top = get(y) + buffer;
			groupBounds.bottom = get(y) + get(height) - nodeHeight - buffer;
			moveElementWithBounds(initialPosition, delta, x, y, groupBounds);
		}
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

export function moveElementWithBounds(
	initialPosition: XYPair,
	delta: XYPair,
	xStore: Writable<number>,
	yStore: Writable<number>,
	bounds: { left: number; right: number; top: number; bottom: number }
) {
	xStore.set(Math.min(Math.max(bounds.left, initialPosition.x + delta.x), bounds.right));
	yStore.set(Math.min(Math.max(bounds.top, initialPosition.y + delta.y), bounds.bottom));
}
