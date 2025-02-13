import type { Writable } from 'svelte/store';
import type { Node, Graph, XYPair, GroupBox } from '$lib/types';
import { writable, get } from 'svelte/store';
import { initialClickPosition, tracking } from '$lib/stores';
import { getSnappedPosition } from '../snapGrid';

const buffer = 10;

export function captureGroup(group: Writable<Set<Node | GroupBox>>): XYPair[] {
	const groupSet = get(group);
	const groupArray = Array.from(groupSet);
	return groupArray.map((node) => {
		return get(node.position);
	});
}

// Create and add a group box to graph.groupBoxes (for testing)
function createGroupBox(graph: Graph, groupName: string) {
	// If the group box already exists, do not create a duplicate
	// if (graph.groupBoxes.hasOwnProperty(groupName)) {
	// 	console.warn(`⚠️ Group box for "${groupName}" already exists! Skipping creation.`);
	// 	return;
	// }
	const groupBox: GroupBox = {
		group: writable(groupName),
		position: writable({ x: 0, y: 0 }),
		dimensions: writable({ width: 300, height: 300 }),
		color: writable('#ff0000'),
		moving: writable(false)
	};
	// Add to graph.groupBoxes before moving nodes
	graph.groupBoxes.set(groupName, groupBox);

	console.log(`Group box for ${groupName} created!`);
	console.log('Current group boxes:', get(graph.groupBoxes));
}

export function moveNodes(graph: Graph, snapTo: number) {
	console.log('moveNodes called'); // Debugging line

	let animationFrame: number;
	const groups = get(graph.groups);
	const groupName = get(graph.activeGroup);

	//log state of stores
	console.log('Graph Groups:', groups);
	console.log('Active Group:', groupName);

	// Ensure that group boxes are created only if missing
	// if (groupName && !graph.groupBoxes.has(groupName)) {
	// 	createGroupBox(graph, groupName);
	// }

	if (!groupName) return;

	const nodeGroup = groups[groupName].nodes;

	if (!nodeGroup) return;

	const initialPositions = get(graph.initialNodePositions);
	const { x: initialClickX, y: initialClickY } = get(initialClickPosition);

	const nodeGroupArray = Array.from(get(nodeGroup));
	const groupBoxes = get(graph.groupBoxes);

	//log groupBoxes
	console.log('Group Boxes:', groupBoxes);

	nodeGroupArray.forEach((node) => node.moving.set(true));

	moveGroup();

	function moveGroup() {
		const cursorPosition = get(graph.cursor);

		let newX = cursorPosition.x - initialClickX;
		let newY = cursorPosition.y - initialClickY;

		//Snap to grid Logic
		if (snapTo) {
			//snaps to nearest grid point
			const snappedPosition = getSnappedPosition(newX, newY);
			newX = snappedPosition.x;
			newY = snappedPosition.y;

			// newX -= newX % snapTo;
			// newY -= newY % snapTo;
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
	console.log('Group Box Position:', { x: groupBoxX, y: groupBoxY });

	return {
		left: groupBoxX + buffer,
		right: groupBoxX + get(groupBox.dimensions.width) - nodeWidth - buffer,
		top: groupBoxY + buffer,
		bottom: groupBoxY + get(groupBox.dimensions.height) - nodeHeight - buffer
	};
}
