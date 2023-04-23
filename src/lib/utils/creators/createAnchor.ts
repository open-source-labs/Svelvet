import type { Anchor, Node, XYPair, Direction, AnchorKey, CSSColorString } from '$lib/types';
import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { CustomWritable } from '$lib/types';
import type { ComponentType } from 'svelte';

export function createAnchor(
	node: Node,
	id: AnchorKey,
	position: XYPair,
	dimensions: { width: number; height: number },
	store: Anchor['store'],
	edge: ComponentType | null,
	type: 'input' | 'output' | null,
	direction?: Direction,
	dynamic?: boolean,
	key?: string | number | null,
	edgeColor?:
		| Writable<CSSColorString | null>
		| CustomWritable<CSSColorString>
		| Readable<CSSColorString>
): Anchor {
	const { width, height } = dimensions;
	const { x, y } = position;
	// Create stores for the anchor offset values
	const nodePosition = get(node.position);
	const xOffset = writable(x - nodePosition.x);
	const yOffset = writable(y - nodePosition.y);

	const offset = { x: xOffset, y: yOffset };

	// Create derived stores for the anchor X and Y positions based on the node position and the offset
	const anchorX = derived(
		[node.position, xOffset],
		([$position, $xOffset]) => $position.x + $xOffset + width / 2
	);
	const anchorY = derived(
		[node.position, yOffset],
		([$position, $yOffset]) => $position.y + $yOffset + height / 2
	);
	// Moving is derived from whether or not the parent node is moving or resizing
	const moving = derived(
		[node.moving, node.resizingWidth, node.resizingHeight, node.rotating],
		([$moving, $resizingWidth, $resizingHeight, $rotating]) => {
			return $moving || $resizingWidth || $resizingHeight || $rotating;
		}
	);
	const rotation = derived([node.rotation], ([$rotation]) => $rotation);
	return {
		id,
		position: { x: anchorX, y: anchorY },
		offset,
		direction: writable(direction),
		dynamic: writable(dynamic || false),
		type,
		edge,
		moving,
		connected: writable(new Set()),
		store: store || null,
		inputKey: key || null,
		edgeColor: edgeColor || writable(null),
		rotation
	};
}
