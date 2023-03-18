import type { Writable } from 'svelte/store';
import type { GraphKey, NodeKey, NodeStore, DataStore } from '.';

export interface Graph {
	id: GraphKey;
	nodes: NodeStore;
	transforms: GraphTransforms;
	data: DataStore;
	isLocked: Writable<boolean>;
	selectedNodes: Writable<Set<NodeKey>>;
}

export interface GraphTransforms {
	translation: {
		x: Writable<number>;
		y: Writable<number>;
	};
	scale: Writable<number>;
	cursor: {
		x: Writable<number>;
		y: Writable<number>;
	};
}
