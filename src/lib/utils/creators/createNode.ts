import { writable } from 'svelte/store';
import type { Node, NodeConfig, Anchor, AnchorKey, NodeKey } from '$lib/types';
import { createStore } from './createStore';

export function createNode(userNode: NodeConfig): Node {
	const {
		id,
		inputs,
		outputs,
		resizable,
		dimensions,
		editable,
		direction,
		header,
		zIndex,
		position,
		selectionColor,
		headerColor,
		borderWidth,
		edge
	} = userNode;
	const { bgColor, borderColor, borderRadius, nodeLevelConnections, textColor, locked, group } =
		userNode;
	const anchorStore = createStore<Anchor, AnchorKey>();

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
			height: writable(dimensions?.height || 0)
		},
		group: writable(group || null),
		locked: writable(locked || false),
		selectable: writable(true),
		inputs: writable(inputs),
		outputs: writable(outputs),
		connectable: writable(true),
		deletable: writable(true),
		hideable: writable(true),
		moving: writable(false),
		resizingWidth: writable(false),
		resizingHeight: writable(false),
		focusable: writable(true),
		editable: writable(editable || false),
		resizable: writable(resizable),
		anchors: anchorStore,
		zIndex: writable(zIndex || 2),
		ariaLabel: `Node ${id}`,
		header: writable(header ? true : false),
		collapsed: writable(false),
		edge: edge || null,
		visible: writable(true),
		collapsible: writable(true),
		borderRadius: writable(borderRadius),
		headerHeight: writable(40),
		bgColor: writable(bgColor || null),
		direction: writable(direction),
		label: writable(userNode.label || ''),
		borderColor: writable(borderColor || null),
		borderWidth: writable(borderWidth),
		selectionColor: writable(selectionColor),
		textColor: writable(textColor || null),
		headerColor: writable(headerColor),
		nodeLevelConnections: writable(nodeLevelConnections)
	};

	return newNode;
}
