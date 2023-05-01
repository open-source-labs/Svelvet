import type { Anchor, Node, Direction, AnchorKey, Graph } from '$lib/types';
import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { CustomWritable, CSSColorString, XYPair } from '$lib/types';
import type { ComponentType } from 'svelte';
import { calculateRelativePosition } from '..';
import { directionVectors } from '$lib/constants';

export function createAnchor(
	graph: Graph,
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

	const offset = writable({
		x: x - nodePosition.x + width / 2,
		y: y - nodePosition.y + height / 2
	});

	// Create derived stores for the anchor X and Y positions based on the node position and the offset
	const anchorPosition = derived([node.position, offset], ([$position, $offset]) => {
		return { x: $position.x + $offset.x, y: $position.y + $offset.y };
	});
	const transforms = graph.transforms;
	const graphDimensions = graph.dimensions;
	const directionStore = writable(direction || 'self');
	const recalculatePosition = () => {
		const anchorElement = document.getElementById(id);
		const direction = get(directionStore);
		const vector = directionVectors[direction];

		if (!anchorElement) return;
		const { x, y, width, height } = anchorElement.getBoundingClientRect();
		const oldOffset = get(offset);
		const oldPosition = get(anchorPosition);

		const { scaled, scale } = calculateRelativePosition(graphDimensions, transforms, { x, y });
		const deltaX = scaled.x - oldPosition.x;
		const deltaY = scaled.y - oldPosition.y;

		offset.set({
			x: oldOffset.x + deltaX + width / scale / 2 + (vector.x * width) / scale / 2,
			y: oldOffset.y + deltaY + height / scale / 2 + (vector.y * height) / scale / 2
		});
	};

	// Moving s derived from whether or not the parent node is moving or resizing
	const moving = derived(
		[node.moving, node.resizingWidth, node.resizingHeight, node.rotating],
		([$moving, $resizingWidth, $resizingHeight, $rotating]) => {
			return $moving || $resizingWidth || $resizingHeight || $rotating;
		}
	);
	const rotation = derived([node.rotation], ([$rotation]) => $rotation);
	return {
		id,
		position: anchorPosition,
		offset,
		direction: directionStore,
		dynamic: writable(dynamic || false),
		type,
		edge,
		moving,
		mounted: writable(false),
		recalculatePosition,
		connected: writable(new Set()),
		store: store || null,
		inputKey: key || null,
		edgeColor: edgeColor || writable(null),
		rotation,
		node
	};
}
