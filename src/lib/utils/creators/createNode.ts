import { writable } from 'svelte/store';
import type { Node, NodeConfig, Anchor, AnchorKey, NodeKey, Direction } from '$lib/types';
import { createStore } from './createStore';
import { get } from 'svelte/store';

export function createNode(userNode: NodeConfig): Node {
	const {
		id,
		inputs,
		outputs,
		resizable,
		dimensions,
		editable,
		direction,
		zIndex,
		position,
		selectionColor,
		borderWidth,
		edge
	} = userNode;
	const { bgColor, borderColor, rotation, borderRadius, connections, textColor, locked, group } =
		userNode;
	const anchorStore = createStore<Anchor, AnchorKey>();

	const recalculateAnchors = (direction: Direction = 'self') => {
		get(anchorStore).forEach((anchor) => {
			if (direction === 'self' || get(anchor.direction) === direction) {
				anchor.recalculatePosition();
			}
		});
	};
	const nodeKey: NodeKey =
		typeof id === 'string' && id.slice(0, 2) === 'N-' ? (id as NodeKey) : `N-${id}`;

	const newNode: Node = {
		id: nodeKey,
		position: writable({
			x: position?.x || 0,
			y: position?.y || 0
		}),
		dimensions: {
			width: writable(dimensions?.width || 0),
			height: writable(dimensions?.height || dimensions?.width)
		},
		group: writable(group || null),
		locked: writable(locked || false),
		selectable: writable(true),
		inputs: writable(inputs),
		outputs: writable(outputs),
		connectable: writable(true),
		deletable: writable(true),
		recalculateAnchors,
		rotation: writable(rotation || 0),
		hideable: writable(true),
		moving: writable(false),
		resizingWidth: writable(false),
		resizingHeight: writable(false),
		rotating: writable(false),
		focusable: writable(true),
		editable: writable(editable || false),
		resizable: writable(resizable),
		anchors: anchorStore,
		zIndex: writable(zIndex || 2),
		ariaLabel: `Node ${id}`,
		collapsed: writable(false),
		edge: edge || null,
		visible: writable(true),
		collapsible: writable(true),
		borderRadius: writable(borderRadius),
		bgColor: writable(bgColor || null),
		direction: writable(direction),
		label: writable(userNode.label || ''),
		borderColor: writable(borderColor || null),
		borderWidth: writable(borderWidth),
		selectionColor: writable(selectionColor),
		textColor: writable(textColor || null),
		connections: writable(connections)
	};

	return newNode;
}
