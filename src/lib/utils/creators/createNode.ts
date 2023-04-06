import { writable } from 'svelte/store';
import type { Node, NodeConfig, Anchor, AnchorKey, NodeKey } from '$lib/types';
import { generateKey } from '$lib/utils/helpers/generateKey';
import {
	NODE_BORDER_COLOR_LIGHT,
	NODE_BORDER_RADIUS,
	NODE_FONT_COLOR_LIGHT,
	NODE_HEIGHT,
	NODE_WIDTH,
	NODE_HEADER_COLOR_LIGHT
} from '$lib/constants';
import { createStore } from './createStore';

export function createNode(userNode: NodeConfig): Node {
	const { id, width, height, resizable, dimensions, header, position, headerColor } = userNode;
	const { bgColor, borderColor, borderRadius, textColor } = userNode;
	const idString: NodeKey =
		id && (typeof id === 'number' || id[0] === 'N') ? `N-${id}` : `N-${generateKey()}`;
	const anchorStore = createStore<Anchor, AnchorKey>();

	const newNode: Node = {
		id: idString,
		position: {
			x: writable(position?.x || 0),
			y: writable(position?.y || 0)
		},
		dimensions: {
			width: writable(width || dimensions?.width || NODE_WIDTH),
			height: writable(height || dimensions?.height || NODE_HEIGHT)
		},
		group: writable(null),
		draggable: writable(true),
		selectable: writable(true),
		connectable: writable(true),
		deletable: writable(true),
		hideable: writable(true),
		moving: writable(false),
		resizingWidth: writable(false),
		resizingHeight: writable(false),
		focusable: writable(true),
		editable: writable(false),
		resizable: writable(resizable),
		anchors: anchorStore,
		zIndex: writable(0),
		ariaLabel: `Node ${id}`,
		header: writable(header ? true : false),
		collapsed: writable(false),
		visible: writable(true),
		collapsible: writable(true),
		inputs: writable({}),
		props: userNode.props || null,
		borderRadius: writable(borderRadius || NODE_BORDER_RADIUS),
		properties: writable({}),
		headerHeight: writable(40),
		bgColor: writable(bgColor || null),
		component: userNode.component || null,
		processor: (inputs, properties) => ({ ...inputs, ...properties }),
		label: writable(userNode.label || ''),
		borderColor: writable(borderColor || NODE_BORDER_COLOR_LIGHT),
		textColor: writable(textColor || NODE_FONT_COLOR_LIGHT),
		headerColor: writable(headerColor || NODE_HEADER_COLOR_LIGHT)
	};

	return newNode;
}
