import type { WritableEdge, EdgeConfig, Anchor } from '$lib/types';
import { writable } from 'svelte/store';
import * as s from '$lib/constants/styles';
import type { EdgeLabel, EdgeKey } from '$lib/types';
import { sortEdgeKey } from '$lib/utils/helpers/sortKey';
import type { ComponentType } from 'svelte';

export function createEdge(
	connection: { source: Anchor; target: Anchor },
	component: ComponentType | null,
	config?: EdgeConfig
): WritableEdge {
	const { source, target } = connection;
	const edgeId: EdgeKey = source.id && target.id ? sortEdgeKey(source.id, target.id) : 'cursor';

	const writableEdge: WritableEdge = {
		id: edgeId,
		target: connection.target,
		source: connection.source,
		component,
		type: writable(config?.type || null),
		color: config?.color || writable(s.EDGE_COLOR),
		width: writable(config?.width || s.EDGE_WIDTH),
		animated: writable(config?.animated || false)
	};
	// if (config?.raiseEdges) writableEdge.raiseEdgeOnSelect = true;
	// if (config?.edgesAbove) writableEdge.edgesAbove = true;
	if (config?.disconnect) writableEdge.disconnect = true;
	if (config?.label) {
		const baseLabel: EdgeLabel = {
			text: writable(config?.label.text),
			color: writable(config?.label?.color || s.EDGE_LABEL_COLOR),
			textColor: writable(config?.label?.textColor || s.EDGE_LABEL_TEXT_COLOR),
			fontSize: writable(config?.label?.fontSize || s.EDGE_LABEL_FONT_SIZE),
			dimensions: {
				width: writable(config?.label.dimensions?.width || s.EDGE_LABEL_WIDTH),
				height: writable(config?.label.dimensions?.height || s.EDGE_LABEL_HEIGHT)
			},
			borderRadius: writable(config?.label.borderRadius || s.EDGE_LABEL_BORDER_RADIUS)
		};
		writableEdge.label = baseLabel;
	}

	return writableEdge;
}
