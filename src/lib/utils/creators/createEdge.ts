import type { WritableEdge, EdgeConfig, Anchor, OutputKey, InputKey } from '$lib/types';
import { writable } from 'svelte/store';
import * as s from '$lib/constants/styles';
import type { EdgeLabel } from '$lib/types';

export function createEdge(
	connection: { source: Anchor<false> | null; target: Anchor<true> | null },
	config?: EdgeConfig
): WritableEdge {
	const { source, target } = connection;

	const writableEdge: WritableEdge = {
		id: source && target ? `${source.id}+${target.id}` : 'cursor',
		target: connection.target,
		source: connection.source,
		type: writable(config?.type || s.EDGE_TYPE),
		color: writable(config?.color || s.EDGE_COLOR),
		width: writable(config?.width || s.EDGE_WIDTH),
		animated: writable(config?.animated || false)
	};
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
