import type { Anchor, InputKey, OutputKey, Node, XYPair, Direction } from '$lib/types';
import { writable, derived, get } from 'svelte/store';

export function createAnchor<Input extends boolean>(
	node: Node,
	id: Input extends true ? InputKey : OutputKey,
	position: XYPair,
	dimensions: { width: number; height: number },
	input: Input,
	direction?: Direction,
	dynamic?: boolean
): Anchor<Input> {
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

	return {
		id,
		position: { x: anchorX, y: anchorY },
		offset,
		direction: writable(direction),
		dynamic: writable(dynamic || false),
		input
	};
}
