import type { Writable } from 'svelte/store';
import type { Node, Graph, XYPair, GroupBox } from '$lib/types';
import { get } from 'svelte/store';
import { initialClickPosition, tracking } from '$lib/stores';

const buffer = 10;

export function captureGroup(group: Writable<Set<Node | GroupBox>>): XYPair[] {
	const groupSet = get(group);
	const groupArray = Array.from(groupSet);
	return groupArray.map((node) => {
		return get(node.position);
	});
}

export function moveNodes(graph: Graph, snapTo: number) {
	let animationFrame: number;
	const groups = get(graph.groups);
	const groupName = get(graph.activeGroup);

	if (!groupName) return;

	const nodeGroup = groups[groupName].nodes;

	if (!nodeGroup) return;

	const initialPositions = get(graph.initialNodePositions);
	const { x: initialClickX, y: initialClickY } = get(initialClickPosition);

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
				if (localGroupName) groupBox = groupBoxes.get(localGroupName);
			}

			if (!groupBox) {
				moveElement(initialPosition, delta, position);
			} else {
				const nodeWidth = get(node.dimensions.width);
				const nodeHeight = get(node.dimensions.height);
				const bounds = calculateRelativeBounds(groupBox, nodeWidth, nodeHeight);
				moveElementWithBounds(initialPosition, delta, position, bounds);
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

export function calculateRelativeBounds(groupBox: GroupBox, nodeWidth: number, nodeHeight: number) {
	const { x: groupBoxX, y: groupBoxY } = get(groupBox.position);
	return {
		left: groupBoxX + buffer,
		right: groupBoxX + get(groupBox.dimensions.width) - nodeWidth - buffer,
		top: groupBoxY + buffer,
		bottom: groupBoxY + get(groupBox.dimensions.height) - nodeHeight - buffer
	};
}
