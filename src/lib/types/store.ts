import type {
	Anchor,
	Graph,
	Node,
	GroupKey,
	GroupBox,
	NodeKey,
	GraphKey,
	AnchorKey
} from '$lib/types';
import type { CursorAnchor, WritableEdge } from './edge';
import type { CustomEdgeKey, generateOutput } from '$lib/utils/creators/';
import type { Writable, Readable } from 'svelte/store';

export interface Store<T, K> {
	subscribe: Writable<Map<K, T>>['subscribe'];
	set: Writable<Map<K, T>>['set'];
	update: Writable<Map<K, T>>['update'];
	add: (item: T, key: K) => Map<K, T>;
	get: (key: K) => T | null;
	getAll: () => T[];
	delete: (key: K) => boolean;
	count: () => number;
}

export interface EdgeStore {
	count: () => number;
	delete: (key: CustomEdgeKey) => boolean;
	get: (key: CustomEdgeKey) => WritableEdge | null;
	getAll: () => WritableEdge[];
	match: (...args: Array<Node | Anchor | null>) => CustomEdgeKey[];
	subscribe: Writable<Map<CustomEdgeKey, WritableEdge>>['subscribe'];
	update: Writable<Map<CustomEdgeKey, WritableEdge>>['update'];
	set: Writable<Map<CustomEdgeKey, WritableEdge>>['set'];
	add: (item: WritableEdge, key: CustomEdgeKey) => void;
}

export type GraphStore = Store<Graph, GraphKey>;
export type NodeStore = Store<Node, NodeKey>;
export type GroupBoxStore = Store<GroupBox, GroupKey>;
export type AnchorStore = Store<Anchor, AnchorKey>;

export type OutputStore = ReturnType<typeof generateOutput>;
export type InputStore = Writable<Record<string, Writable<unknown> | Readable<unknown>>>;
