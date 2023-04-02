import type {
	InputKey,
	NodeKey,
	OutputKey,
	WritableEdge,
	Edge,
	CSSColorString,
	Connection,
	EdgeConfig
} from '$lib/types';
import { writable } from 'svelte/store';
import { makeObjectValuesWritable } from '../writables';
import * as s from '$lib/constants/styles';

export function createNativeEdge(edge: Edge): WritableEdge {
	const { target, source, type, color, width, label, animated } = edge;
	const { noHandle, arrow, clickCallback, className, sourceAnchorCb, targetAnchorCb } = edge;

	const sourceKey: NodeKey = `N-${(source as Edge['source'] & { node?: string }).node || source}`;
	const targetKey: NodeKey = `N-${(target as Edge['target'] & { node?: string }).node || target}`;
	const sourceOutputKey: OutputKey = `O-${
		(source as Edge['source'] & { output?: string }).output || '?'
	}`;
	const targetInputKey: InputKey = `I-${
		(target as Edge['target'] & { input?: string }).input || '?'
	}`;

	const writableEdge: WritableEdge = {
		target: makeObjectValuesWritable({ node: targetKey, input: targetInputKey }),
		source: makeObjectValuesWritable({ node: sourceKey, output: sourceOutputKey }),
		type: writable(type),
		color: writable(color),
		width: writable(width),
		animated: writable(animated)
	};

	if (label) {
		const baseLabel = {
			text: '',
			color: 'black' as CSSColorString,
			textColor: 'white' as CSSColorString,
			fontSize: 12,
			dimensions: {
				width: 0,
				height: 0
			},
			borderRadius: 10
		};

		if (typeof label === 'object') {
			const newLabel = {
				...baseLabel,
				text: label.text,
				color: label.color || ('black' as CSSColorString),
				textColor: label.textColor || ('white' as CSSColorString),
				fontSize: label.fontSize || 12,
				dimensions: {
					width: writable(label?.dimensions?.width || 0),
					height: writable(label?.dimensions?.height || 0)
				},
				borderRadius: label.borderRadius || 10
			};

			writableEdge.label = {
				...makeObjectValuesWritable(newLabel),
				dimensions: newLabel.dimensions
			};
		} else {
			baseLabel.text = label;
			writableEdge.label = {
				...makeObjectValuesWritable(baseLabel),
				dimensions: makeObjectValuesWritable(baseLabel.dimensions)
			};
		}
	}
	return writableEdge;
}

export function createEdge(connection: Connection, config?: EdgeConfig): WritableEdge {
	const writableEdge: WritableEdge = {
		target: {
			node: writable(connection.target),
			input: writable(connection.input)
		},
		source: {
			node: writable(connection.source),
			output: writable(connection.output)
		},
		type: writable(config?.type || s.EDGE_TYPE),
		color: writable(config?.color || s.EDGE_COLOR),
		width: writable(config?.width?.toString() + 'px' || s.EDGE_WIDTH),
		animated: writable(config?.animated || false)
	};
	if (config?.label) {
		const baseLabel = {
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
