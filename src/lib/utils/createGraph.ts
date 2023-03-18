import { writable } from 'svelte/store';
import type { DataObject, Graph, Node } from '$lib/types';
import { createStore } from './createStore';

export function createGraph(id: string): Graph {
	return {
		id,
		nodes: createStore<Node>(),
		transforms: {
			translation: {
				x: writable(0),
				y: writable(0)
			},
			scale: writable(1),
			cursor: {
				x: writable(0),
				y: writable(0)
			}
		},
		data: createStore<DataObject>(),
		isLocked: writable(false),
		selectedNodes: writable(new Set())
	};
}
