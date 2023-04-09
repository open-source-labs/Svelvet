import type {
	Anchor,
	Graph,
	Node,
	GroupKey,
	GroupBox,
	EdgeKey,
	NodeKey,
	GraphKey,
	AnchorKey
} from '$lib/types';
import type { createStore } from '$lib/utils/';
import type { WritableEdge } from './edge';
import type { generateOutput } from '$lib/utils/creators/';
import type { Writable, Readable } from 'svelte/store';

export type GraphStore = ReturnType<typeof createStore<Graph, GraphKey>>;
export type NodeStore = ReturnType<typeof createStore<Node, NodeKey>>;
export type GroupBoxStore = ReturnType<typeof createStore<GroupBox, GroupKey>>;
export type EdgeStore = ReturnType<typeof createStore<WritableEdge, EdgeKey>>;
export type AnchorStore = ReturnType<typeof createStore<Anchor, AnchorKey>>;

export type OutputStore = ReturnType<typeof generateOutput>;
export type InputStore = Writable<Record<string, Writable<unknown> | Readable<unknown>>>;
