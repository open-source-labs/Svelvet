import type { Graph, Node, DataObject } from '.';
import type { createStore } from '$lib/utils/createStore';

// Usage example:
export type GraphStore = ReturnType<typeof createStore<Graph>>;
export type NodeStore = ReturnType<typeof createStore<Node>>;
export type DataStore = ReturnType<typeof createStore<DataObject>>;
