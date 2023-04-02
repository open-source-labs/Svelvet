import type { InputKey, NodeKey, OutputKey, WritableEdge, Edge, CSSColorString } from '$lib/types';
import { writable } from 'svelte/store';
import { makeObjectValuesWritable } from '../writables';

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
