import { writable } from 'svelte/store';
import type { Node, ConfigObject } from '$lib/types';

export function createNode(
	id: string,
	width: number,
	height: number,
	x: number,
	y: number,
	parentNodes: Array<Node>,
	type: string,
	configObject: ConfigObject
): Node {
	return {
		id,
		dimensions: {
			width: writable(width),
			height: writable(height)
		},
		position: {
			x: writable(x),
			y: writable(y)
		},
		inputNodes: writable(new Set(parentNodes)),
		outputNodes: writable(new Set()),
		componentRef: type,
		configObject: writable(configObject),
		selected: writable(false)
	};
}
