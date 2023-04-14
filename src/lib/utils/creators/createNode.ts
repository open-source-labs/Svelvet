import { writable } from 'svelte/store';
import type { Node, NodeConfig, Anchor, AnchorKey, NodeKey } from '$lib/types';
import { NODE_HEIGHT, NODE_WIDTH } from '$lib/constants';
import { createStore } from './createStore';

export function createNode(userNode: NodeConfig): Node {
	const {
		id,
		width,
		height,
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
	const { bgColor, borderColor, borderRadius, textColor, locked, group } = userNode;
	const anchorStore = createStore<Anchor, AnchorKey>();

	const nodeKey: NodeKey =
		typeof id === 'string' && id.slice(0, 2) === 'N-' ? (id as NodeKey) : `N-${id}`;

	const newNode: Node = {
		id: nodeKey,
		position: {
			x: writable(position?.x || 0),
			y: writable(position?.y || 0)
		},
		dimensions: {
			width: writable(width || dimensions?.width || NODE_WIDTH),
			height: writable(height || dimensions?.height || NODE_HEIGHT)
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
		borderColor: writable(borderColor),
		borderWidth: writable(borderWidth),
		selectionColor: writable(selectionColor),
		textColor: writable(textColor),
		headerColor: writable(headerColor)
	};

	return newNode;
}
