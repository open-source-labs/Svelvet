import type {
	Anchor,
	Graph,
	Node,
	GroupKey,
	GroupBox,
	EdgeKey,
	NodeKey,
	GraphKey,
	AnchorKey,
	GenericKey
} from '$lib/types';
import type { WritableEdge } from './edge';
import type { generateOutput } from '$lib/utils/creators/';
import type { Writable, Readable } from 'svelte/store';

export interface Store<T, K extends GenericKey> {
	subscribe: Writable<Record<K, T>>['subscribe'];
	set: Writable<Record<K, T>>['set'];
	update: Writable<Record<K, T>>['update'];
	add: (item: T, key: K) => Record<K, T>;
	get: (key: K) => T | null;
	delete: (key: K) => boolean;
	count: () => number;
}

export type GraphStore = Store<Graph, GraphKey>;
export type NodeStore = Store<Node, NodeKey>;
export type GroupBoxStore = Store<GroupBox, GroupKey>;
export type EdgeStore = Store<WritableEdge, EdgeKey>;
export type AnchorStore = Store<Anchor, AnchorKey>;

export type OutputStore = ReturnType<typeof generateOutput>;
export type InputStore = Writable<Record<string, Writable<unknown> | Readable<unknown>>>;
