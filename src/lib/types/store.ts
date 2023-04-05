import type {
	Anchor,
	InputKey,
	OutputKey,
	Graph,
	Node,
	GroupKey,
	GroupBox,
	EdgeKey,
	NodeKey,
	GraphKey
} from '$lib/types';
import type { createStore } from '$lib/utils/';
import type { WritableEdge } from './edge';

export type GraphStore = ReturnType<typeof createStore<Graph, GraphKey>>;
export type NodeStore = ReturnType<typeof createStore<Node, NodeKey>>;
export type GroupBoxStore = ReturnType<typeof createStore<GroupBox, GroupKey>>;
export type EdgeStore = ReturnType<typeof createStore<WritableEdge, EdgeKey>>;
export type AnchorStore = ReturnType<typeof createStore<Anchor, OutputKey | InputKey>>;
