import type { Writable } from 'svelte/store';
import type { Node, Graph, XYPair, GroupBox } from '$lib/types';
import { get } from 'svelte/store';
import { initialClickPosition, tracking } from '$lib/stores';

export function captureGroup(group: Writable<Set<Node | GroupBox>>): XYPair[] {
	const groupSet = get(group);
	const groupArray = Array.from(groupSet);
	return groupArray.map((node) => {
		return get(node.position);
	});
}

export function moveNodes(graph: Graph, snapTo?: number) {
	let animationFrame: number;
	const groups = get(graph.groups);
	const groupName = get(graph.activeGroup);

	if (!groupName) return;

	const nodeGroup = groups[groupName].nodes;

	if (!nodeGroup) return;

	const initialPositions = get(graph.initialNodePositions);
	const { x: initialClickX, y: initialClickY } = get(initialClickPosition);
	const groupBounds = {
		left: -Infinity,
		right: Infinity,
		top: -Infinity,
		bottom: Infinity
	};
	const nodeGroupArray = Array.from(get(nodeGroup));
	const groupBoxes = get(graph.groupBoxes);

	nodeGroupArray.forEach((node) => node.moving.set(true));

	moveGroup();

	function moveGroup() {
		const cursorPosition = get(graph.cursor);

		let newX = cursorPosition.x - initialClickX;
		let newY = cursorPosition.y - initialClickY;

		if (snapTo) {
			newX -= newX % snapTo;
			newY -= newY % snapTo;
		}

		const delta = { x: newX, y: newY };

		nodeGroupArray.forEach((node, index) => {
			const { group, position } = node;

			const initialPosition = initialPositions[index];

			let groupBox: GroupBox | undefined;

			if (groupName === 'selected') {
				const localGroupName = get(group);
				if (localGroupName) groupBox = groupBoxes[localGroupName];
			}

			if (!groupBox) {
				moveElement(initialPosition, delta, position);
			} else {
				const nodeWidth = get(node.dimensions.width);
				const nodeHeight = get(node.dimensions.height);
				const { x: groupBoxX, y: groupBoxY } = get(groupBox.position);
				const buffer = 10;
				groupBounds.left = groupBoxX + buffer;
				groupBounds.right = groupBoxX + get(groupBox.dimensions.width) - nodeWidth - buffer;
				groupBounds.top = groupBoxY + buffer;
				groupBounds.bottom = groupBoxY + get(groupBox.dimensions.height) - nodeHeight - buffer;
				moveElementWithBounds(initialPosition, delta, position, groupBounds);
			}
		});

		if (get(tracking)) {
			animationFrame = requestAnimationFrame(moveGroup);
		} else {
			cancelAnimationFrame(animationFrame);
		}
	}
}

export function moveElement(initialPosition: XYPair, delta: XYPair, position: Writable<XYPair>) {
	position.set({
		x: initialPosition.x + delta.x,
		y: initialPosition.y + delta.y
	});
}

export function moveElementWithBounds(
	initialPosition: XYPair,
	delta: XYPair,
	position: Writable<XYPair>,
	bounds: { left: number; right: number; top: number; bottom: number }
) {
	position.set({
		x: Math.min(Math.max(bounds.left, initialPosition.x + delta.x), bounds.right),
		y: Math.min(Math.max(bounds.top, initialPosition.y + delta.y), bounds.bottom)
	});
}
