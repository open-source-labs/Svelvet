import { writable } from 'svelte/store';
import type { DataObject, Graph, Node, NodeKey } from '$lib/types';
import { createStore } from './createStore';

export function createGraph(id: string): Graph {
	return {
		id,
		nodes: createStore<Node>(),
		edges: writable(new Map()),
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
		bounds: {
			top: writable(Infinity),
			left: writable(Infinity),
			right: writable(-Infinity),
			bottom: writable(-Infinity)
		},
		data: createStore<DataObject>(),
		isLocked: writable(false),
		connectingFrom: writable(null),
		groups: writable({
			selected: writable(new Set<Node>())
		})
	};
}
