import type { Anchor, Node, XYPair, Direction, AnchorKey } from '$lib/types';
import { writable, derived, get } from 'svelte/store';

export function createAnchor(
	node: Node,
	id: AnchorKey,
	position: XYPair,
	dimensions: { width: number; height: number },
	store: Anchor['store'],
	type: 'input' | 'output' | null,
	direction?: Direction,
	dynamic?: boolean
): Anchor {
	const { width, height } = dimensions;
	const { x, y } = position;
	// Create stores for the anchor offset values
	const xOffset = writable(x - get(node.position.x));
	const yOffset = writable(y - get(node.position.y));
	const offset = { x: xOffset, y: yOffset };

	// Create derived stores for the anchor X and Y positions based on the node position and the offset
	const anchorX = derived(
		[node.position.x, xOffset],
		([$nodeX, $xOffset]) => $nodeX + $xOffset + width / 2
	);
	const anchorY = derived(
		[node.position.y, yOffset],
		([$nodeY, $yOffset]) => $nodeY + $yOffset + height / 2
	);
	// Moving is derived from whether or not the parent node is moving or resizing
	const moving = derived(
		[node.moving, node.resizingWidth, node.resizingHeight],
		([$moving, $resizingWidth, $resizingHeight]) => $moving || $resizingWidth || $resizingHeight
	);

	return {
		id,
		position: { x: anchorX, y: anchorY },
		offset,
		direction: writable(direction),
		dynamic: writable(dynamic || false),
		type,
		moving,
		connected: writable(new Set()),
		store: store || null
	};
}
